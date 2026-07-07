import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const preview = await draftMode();

  preview.disable();

  const pathname = request.nextUrl.searchParams.get('redirect');

  redirect(pathname?.startsWith('/') ? pathname : '/blog');
}
