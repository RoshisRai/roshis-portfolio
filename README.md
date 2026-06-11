# Advanced Full-Stack Portfolio & Case Study Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-roshis.dev-0052FF?style=for-the-badge&logo=vercel)](https://www.roshis.dev)

<img src="https://i.ibb.co/20D6GvtT/og-image.png" alt="Homepage Preview" style="width: 100%; height: auto; object-fit: contain;" />

An engineering-forward, highly interactive portfolio architected to showcase both deep systems-level data engineering and sophisticated frontend UX capabilities. This project serves as a live demonstration of modern web technologies, ranging from custom Retrieval-Augmented Generation (RAG) pipelines on the backend to dynamic WebGL renderings and GSAP animations on the frontend.

---

## Key Features Overview

### **AI & Data Engineering**
- **Custom RAG Search Pipeline**: Built with Supabase, OpenAI, and native PostgreSQL vector capabilities.
- **Structure-Aware Chunking**: Intelligently splits markdown on heading boundaries and normalizes lists to preserve logical document layout for superior retrieval continuity.
- **Idempotent Upserts via Content Hashing**: Prevents database duplication by generating stable SHA256 hashes of markdown contents.
- **Advanced Hybrid Search**: PostgreSQL RPC resolving query ranking with both **Reciprocal Rank Fusion (RRF)** over Semantic representations (HNSW) and Full-Text Search (`tsvector`/`tsquery`).
- **Automated Data Lifecycle**: Built-in garbage collection via `delete_stale_chunks` prevents database bloat from orphaned data.

### **Creative Frontend UI/UX**
- **Complex GSAP Sequencing**: Orchestrates timeline-based, scroll-triggered animations to construct a cinematic user experience seamlessly integrating with React.
- **State-Driven Custom Cursor**: Fluidly adapts to DOM bounding boxes (magnetic attraction, morphing radii, and dynamic intersection zones).
- **Case Study Subsystem**: Next.js App Router and Velite for dynamic MDX-based project generation.
- **Serverless Contact Pipeline**: Streamlined contact form via Server Actions, Zod validation, and Resend + React Email for immediate notifications.
- **Interactive 3D Hero Scene**: Utilizes React Three Fiber (THREE.js) to render a dynamic, cursor-responsive WebGL particle morphing visualization and floating orbs with custom shaders.
- **WebGL Globe Integration**: Employs `cobe` to render a highly performant, draggable 3D globe visualization. 

---

## Technical Deep Dive: AI & Data Pipeline

### **Structure-Aware Chunking**
Unlike naive text-splitting—which often arbitrarily severs semantic context—this pipeline employs **Structure-Aware Chunking**. By respecting layout boundaries (specifically H1–H3 markers) and shielding fenced code blocks, the embedding model retains deep contextual meaning. This decreases retrieval hallucination dramatically. When chunks exceed limits, it falls back to sentence-aware splitting.

### **Supabase PostgreSQL & Vector Operations**
The backend leverages Supabase as a managed PostgreSQL instance, deeply integrated with the `vector` and `pg_trgm` extensions. To maintain data integrity across builds and content updates, the ingestion pipeline relies exclusively on **idempotent operations**. Uses `upsert` transactions matching on deterministic `content_hash` strings to seamlessly propagate updates.

Before ingestion completes, the `delete_stale_chunks` function ensures optimal data hygiene by sweeping the database for obsolete node hashes.

### **Hybrid Search RPC (Full-Text + Semantic Vector)**
The query engine operates via a custom PostgreSQL Remote Procedure Call (RPC) called `hybrid_search`. This function ranks lexical accuracy via **PostgreSQL Full-Text Search (ts_rank_cd)** alongside semantic matching evaluated by **Cosine Vector Similarity (HNSW)**. The combined scores are algorithmically blended using **Reciprocal Rank Fusion (RRF)** yielding extremely robust search results.

---

## Creative Frontend Architecture

### **WebGL & Animation Sequencing**
The user interface avoids traditional static interactions by introducing sophisticated WebGL interactions, including a cursor-responsive, dynamic particle morphing scene in the hero section built with **React Three Fiber (THREE.js)** and an interactive `cobe` globe renderer. To ensure elements don't block the main thread, complex animations (like split-text sequences and timeline staggering) are handled exclusively via the **GSAP** (GreenSock Animation Platform) and tied directly to smooth scroll handlers via Lenis.

### **State-Driven Custom Cursor**
Moving beyond native pointers, the platform implements a specialized State-Driven Custom Cursor (`useCursor` hook). By actively listening to hover intent and intersecting geometric zones, the cursor morphs intelligently—attaching magnet-like to specific UI components or scaling its radius dynamically over interactive maps and cards.

### **Infrastructure & Contact Pipeline**
The frontend utilizes optimized static-site generation (SSG) with **Velite**, enabling statically typed generated files from raw Markdown. A streamlined Contact Form pipeline bypasses generic third-party interfaces, firing automated payloads directly to a personal email using **Resend** and **Zod** for fully validated, server-side payload handling.

---
## Database Schema, RPC Initialization & Cleanup Function

The following represents the core SQL infrastructure initializing the `knowledge_chunks` architecture, including the hybrid search RPC and the idempotent ingestion cleanup utility:

```sql
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
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    section         TEXT NOT NULL,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,

    -- Stable deterministic hash for idempotent upserts
    content_hash    TEXT NOT NULL,

    fts             TSVECTOR GENERATED ALWAYS AS (
                        to_tsvector(
                            'english',
                            COALESCE(title, '') || ' ' || COALESCE(content, '')
                        )
                    ) STORED,

    embedding       VECTOR(1536) NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- Unique hash index for idempotent ingestion
CREATE UNIQUE INDEX IF NOT EXISTS knowledge_chunks_content_hash_idx
    ON knowledge_chunks (content_hash);

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
-- CLEANUP FUNCTION (idempotent ingestion)
-- ==========================================
CREATE OR REPLACE FUNCTION delete_stale_chunks(
    active_hashes TEXT[]
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    DELETE FROM knowledge_chunks
    WHERE content_hash != ALL(active_hashes);
$$;

-- ==========================================
-- HYBRID SEARCH FUNCTION (RRF)
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
```

---

## Local Setup & Installation

Follow these steps to deploy the architecture locally.

### 1. Clone the Repository
```bash
git clone https://github.com/RoshisRai/roshis-portfolio.git
cd roshis-portfolio
```

### 2. Install Dependencies
*Designed for `pnpm` workspace environments.*
```bash
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the project and populate it with the required API keys and credentials:

```env
# SEND EMAIL
RESEND_API_KEY=
MAIL_FROM="Portfolio Contact <contact@your-company.com>"
PERSONAL_EMAIL="example@gmail.com"

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OPENAI
OPENAI_API_KEY=

# UPSTASH REDIS (FOR RATE LIMITING)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ANALYTICS
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 4. Initialize Local Development
Boot up the Next.js development server.
```bash
pnpm dev
```
Navigate to `http://localhost:3000` to inspect the build.

---

## Engineering Highlights

- Custom RAG implementation without external frameworks
- Hybrid semantic + lexical retrieval
- PostgreSQL-native vector search architecture
- Idempotent ingestion pipeline
- GPU-accelerated WebGL rendering (React Three Fiber, THREE.js)
- Type-safe MDX content system
- Serverless email infrastructure
- Production-grade Next.js architecture
- Fully responsive and accessible UI

---

## Live Application

**Website:** [https://www.roshis.dev](https://www.roshis.dev)

Explore the full platform, AI search experience, case studies, and interactive engineering showcase.