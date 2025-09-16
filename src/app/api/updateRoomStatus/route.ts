// src/app/api/updateRoomStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/firebase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { roomName, status } = await req.json();

    if (typeof roomName !== 'string' || roomName.trim() === '' ||
        typeof status !== 'string' || status.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid roomName or status' },
        { status: 400 }
      );
    }

    await db.collection('rooms').doc(roomName).update({ request: status });

    return NextResponse.json({ message: 'Room status updated successfully' });
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
