/**
 * Structure-aware markdown chunker for RAG systems.
 *
 * Strategy:
 * - Split on H1–H3 headings to preserve logical document sections
 * - Protect code blocks from being split mid-fence
 * - Normalize lists and whitespace for consistent embeddings
 * - Use sentence-aware splitting instead of naive character truncation
 * - Carry overlap sentences across chunk boundaries for retrieval continuity
 */

export interface KnowledgeChunk {
    section: string
    title: string
    content: string
}

interface ChunkOptions {
    maxChunkLength?: number   // soft character limit per chunk, default 800
    overlapSentences?: number // sentences carried into next chunk, default 1
}

// Flattens newlines then splits on terminal punctuation.
// Trailing fragment (no punctuation) is captured by the second alternative.
// Falls back to the full text if nothing matches.
const splitIntoSentences = (text: string): string[] =>
    text.replace(/\n+/g, " ")
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
        ?.map(s => s.trim())
        .filter(Boolean)
        ?? [text];

export function chunkMarkdown(
    markdown: string,
    section: string,
    options: ChunkOptions = {}
): KnowledgeChunk[] {
    const {
        maxChunkLength = 800,
        overlapSentences = 1,
    } = options;

    const chunks: KnowledgeChunk[] = [];

    // Strip fenced code blocks — they often contain pseudo-headings and
    // multi-line syntax that would corrupt the heading splitter below.
    const safeMarkdown = markdown.replace(/```[\s\S]*?```/g, "");

    const blocks = safeMarkdown.split(/(?=^#{1,3}\s)/m);

    for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Fall back to the section name for preamble text before the first heading.
        const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
        const title = headingMatch?.[1]?.trim() ?? section;
        const body = headingMatch
            ? trimmed.slice(headingMatch[0].length).trim()
            : trimmed;

        if (!body) continue;

        // Unify bullet markers (-, *, 1.) → • so the same list item doesn't
        // get different token representations depending on the author's style.
        const baseText = body
            .replace(/\n{3,}/g, "\n\n")
            .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, "• ")
            .trim();

        if (baseText.length <= maxChunkLength) {
            chunks.push({ section, title, content: baseText });
            continue;
        }

        const sentences = splitIntoSentences(baseText);
        if (!sentences.length) continue;

        let currentChunk = "";
        let currentSentences: string[] = [];

        for (const sentence of sentences) {

            // Single sentence exceeds the limit — flush buffer and push it as-is.
            if (sentence.length > maxChunkLength) {
                if (currentChunk.trim()) {
                    chunks.push({ section, title, content: currentChunk.trim() });
                    currentChunk = "";
                    currentSentences = [];
                }
                chunks.push({ section, title, content: sentence });
                continue;
            }

            if (
                currentChunk.length + sentence.length + 1 > maxChunkLength &&
                currentChunk.length > 0
            ) {
                chunks.push({ section, title, content: currentChunk.trim() });

                // Carry the last N sentences into the next chunk so queries
                // spanning a boundary can still find a relevant match.
                // Only overlaps when buffer has more sentences than the overlap
                // count — prevents padding the first flush with nothing useful.
                const overlap = currentSentences.length > overlapSentences
                    ? currentSentences.slice(-overlapSentences).join(" ")
                    : "";

                currentChunk = overlap ? `${overlap} ${sentence}` : sentence;
                currentSentences = overlap
                    ? [...currentSentences.slice(-overlapSentences), sentence]
                    : [sentence];

            } else {
                currentChunk += (currentChunk ? " " : "") + sentence;
                currentSentences.push(sentence);
            }
        }

        // Flush remaining sentences that didn't fill a full chunk.
        if (currentChunk.trim()) {
            chunks.push({ section, title, content: currentChunk.trim() });
        }
    }

    return chunks;
}