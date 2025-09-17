import { NextResponse } from 'next/server';

export async function GET() {
  // Basic health check
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasLivekitConfig: !!(process.env.NEXT_PUBLIC_LIVEKIT_API_KEY && process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET)
  };

  return NextResponse.json(health, { status: 200 });
}
