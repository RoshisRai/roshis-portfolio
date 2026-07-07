import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { sanityConfig } from '@/sanity/env';

export const runtime = 'nodejs';

interface SanityWebhookPayload {
  _type: string;
  slug?: {
    current: string;
  };
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!sanityConfig.webhookSecret) {
    console.error('SANITY_WEBHOOK_SECRET is not configured.');

    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  const secret = request.headers.get('x-sanity-webhook-secret');

  if (secret !== sanityConfig.webhookSecret) {
    return unauthorized();
  }

  let payload: SanityWebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return badRequest('Invalid JSON payload.');
  }

  const paths = new Set<string>();

  switch (payload._type) {
    case 'post':
      paths.add('/');
      paths.add('/blog');

      if (payload.slug?.current) {
        paths.add(`/blog/${payload.slug.current}`);
      }

      break;

    case 'category':
    case 'tag':
      paths.add('/blog');
      break;

    default:
      return NextResponse.json({
        revalidated: false,
        ignored: true,
        type: payload._type,
      });
  }

  try {
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      type: payload._type,
      paths: [...paths],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sanity revalidation failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to revalidate.',
      },
      {
        status: 500,
      },
    );
  }
}
