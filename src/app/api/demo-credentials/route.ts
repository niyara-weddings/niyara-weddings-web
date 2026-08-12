import { NextResponse } from 'next/server';

export function GET() {
  const username = process.env.DEMO_USERNAME;
  const password = process.env.DEMO_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      {
        success: false,
        message: 'Demo access is not configured',
        data: null,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: { username, password },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
