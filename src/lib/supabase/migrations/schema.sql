-- ==========================================
-- EXTENSIONS (in dedicated schema)
-- ==========================================
CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS vector  SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- ==========================================
-- TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    section     TEXT NOT NULL,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    fts         TSVECTOR GENERATED ALWAYS AS (
                    to_tsvector(
                        'english', 
                        COALESCE(title, '') || ' ' || COALESCE(content, '')
                    )
                ) STORED,
    embedding   VECTOR(1536) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- RLS
-- ==========================================
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read knowledge_chunks"
ON public.knowledge_chunks
FOR SELECT
USING (true);

-- ==========================================
-- INDEXES
-- ==========================================
-- Full-text Search
CREATE INDEX IF NOT EXISTS knowledge_chunks_fts_idx
    ON knowledge_chunks 
    USING GIN(fts);

-- Semantic vector search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
    ON knowledge_chunks 
    USING HNSW(embedding vector_cosine_ops);

-- Fuzzy keyword matching
CREATE INDEX IF NOT EXISTS knowledge_chunks_content_trgm_idx
    ON knowledge_chunks 
    USING GIN(content gin_trgm_ops);

-- ==========================================
-- HYBRID SEARCH FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION hybrid_search(
    query_text          TEXT,
    query_embedding     VECTOR(1536),
    match_count         INT     DEFAULT 5,
    full_text_weight    FLOAT   DEFAULT 1.0,
    semantic_weight     FLOAT   DEFAULT 1.0,
    rrf_k               INT     DEFAULT 50
)
RETURNS TABLE (
    id          BIGINT,
    section     TEXT,
    title       TEXT,
    content     TEXT,
    similarity  FLOAT
)
LANGUAGE SQL 
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
WITH 
-- ==========================================
-- Parse tsquery once
-- ==========================================
query AS (
    SELECT websearch_to_tsquery('english', query_text) AS ts_query
),

-- ==========================================
-- Full-text ranking
-- ==========================================
full_text AS (
    SELECT
        kc.id,
        ROW_NUMBER() OVER(
            ORDER BY ts_rank_cd(kc.fts, q.ts_query) DESC
        ) AS rank_ix
    FROM knowledge_chunks kc
    CROSS JOIN query q
    WHERE kc.fts @@ q.ts_query
    LIMIT LEAST(match_count, 30) * 2
),

-- ==========================================
-- Semantic ranking
-- ==========================================
semantic AS (
    SELECT
        kc.id,
        ROW_NUMBER() OVER(
            ORDER BY kc.embedding <=> query_embedding
        ) AS rank_ix
    FROM knowledge_chunks kc
    LIMIT LEAST(match_count, 30) * 2
),

-- ==========================================
-- Reciprocal Rank Fusion
-- ==========================================
fused AS (
    SELECT
        COALESCE(ft.id, sem.id) AS id,
        (
            COALESCE(
                1.0 / (rrf_k + ft.rank_ix),
                0.0
            ) * full_text_weight

            +

            COALESCE(
                1.0 / (rrf_k + sem.rank_ix),
                0.0
            ) * semantic_weight

        ) AS similarity
    FROM full_text ft
    FULL OUTER JOIN semantic sem
        ON ft.id = sem.id
)

-- ==========================================
-- Final hydrated results
-- ==========================================
SELECT
    kc.id,
    kc.section,
    kc.title,
    kc.content,
    fused.similarity
FROM fused
JOIN knowledge_chunks kc 
    ON fused.id = kc.id
ORDER BY fused.similarity DESC
LIMIT LEAST(match_count, 30)
$$;