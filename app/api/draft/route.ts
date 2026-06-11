import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

// Enable Draft Mode and redirect back to the referer or root
export async function GET(req: NextRequest) {
  try {
    draftMode().enable();
  } catch (e) {
    // If running outside Next runtime, no-op
    console.warn('draftMode.enable() failed or not available in this runtime:', e);
  }

  const referer = req.headers.get('referer') || '/';
  return NextResponse.redirect(referer);
}

// Also accept POST for form-based preview requests
export async function POST(req: NextRequest) {
  try {
    draftMode().enable();
  } catch (e) {
    console.warn('draftMode.enable() failed or not available in this runtime:', e);
  }

  const referer = req.headers.get('referer') || '/';
  return NextResponse.redirect(referer);
}
