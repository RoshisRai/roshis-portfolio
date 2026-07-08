import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { sanityConfig } from '@/sanity/env';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json(
    {
      error: 'Invalid preview token.',
    },
    {
      status: 401,
    },
  );
}

export async function GET(request: NextRequest) {
  if (!sanityConfig.previewSecret) {
    console.error('SANITY_PREVIEW_SECRET is missing.');

    return NextResponse.json(
      {
        error: 'Server configuration error.',
      },
      {
        status: 500,
      },
    );
  }

  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== sanityConfig.previewSecret) {
    return unauthorized();
  }

  const slug = request.nextUrl.searchParams.get('slug');

  const preview = await draftMode();

  preview.enable();

  const destination =
    slug && /^[a-z0-9-]+$/i.test(slug) ? `/blog/${slug}` : '/blog';

  redirect(destination);
}
