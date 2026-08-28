import { NextRequest, NextResponse } from "next/server";

import {
  deleteBlogPostChunks,
  ingestBlogPost,
} from "@/lib/rag/blog-ingest";

export const runtime = "nodejs";
export const maxDuration = 60;

interface SanityIngestPayload {
  _id?: string;
  _type?: string;
  operation?: "create" | "update" | "delete";
  ragEnabled?: boolean;
  slug?: string | { current?: string };
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function payloadSlug(payload: SanityIngestPayload): string | undefined {
  if (typeof payload.slug === "string") {
    return payload.slug || undefined;
  }

  return payload.slug?.current || undefined;
}

export async function POST(request: NextRequest) {
  const ingestSecret = process.env.INGEST_SECRET;

  if (!ingestSecret) {
    console.error("INGEST_SECRET is not configured.");

    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const secret = request.headers.get("x-ingest-secret");

  if (secret !== ingestSecret) {
    return unauthorized();
  }

  let payload: SanityIngestPayload;

  try {
    payload = await request.json();
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  if (payload._type && payload._type !== "post") {
    return NextResponse.json({
      ingested: false,
      ignored: true,
      type: payload._type,
    });
  }

  const postId = payload._id;
  const slug = payloadSlug(payload);
  const shouldRemove =
    payload.operation === "delete" || payload.ragEnabled === false;

  if (shouldRemove) {
    if (!slug) {
      return badRequest(
        "Missing slug. Include slug.current in the webhook projection so chunks can be deleted.",
      );
    }

    const removed = await deleteBlogPostChunks(slug);

    return NextResponse.json({
      ingested: false,
      removed: true,
      slug,
      ...removed,
    });
  }

  if (!postId) {
    return badRequest("Missing _id.");
  }

  try {
    const result = await ingestBlogPost(postId);

    if (result.error) {
      if (!slug) {
        return NextResponse.json(
          {
            ingested: false,
            ...result,
          },
          { status: 404 },
        );
      }

      const removed = await deleteBlogPostChunks(slug);

      return NextResponse.json({
        ingested: false,
        removed: true,
        slug,
        ...result,
        ...removed,
      });
    }

    return NextResponse.json({
      ingested: true,
      postId,
      ...result,
    });
  } catch (error) {
    console.error("Blog ingest failed:", error);

    return NextResponse.json(
      { error: "Failed to ingest post." },
      { status: 500 },
    );
  }
}
