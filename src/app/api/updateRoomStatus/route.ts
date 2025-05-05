import express from 'express';
import { db } from '@/utils/firebase'; // adjust path
import { NextRequest, NextResponse } from 'next/server';

const router = express.Router();

export async function POST(req: NextRequest) {
  const { roomName, status } = await req.json()

  if (!roomName || !status) {
    return NextResponse.json({ error: 'Missing roomName or status' },{ status: 403});
  }

  try {
    const roomRef = db.collection('rooms').doc(roomName);
    await roomRef.update({ request: status });
    return NextResponse.json({ message: 'Room status updated successfully' });
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' },{ status: 500});
  }
};

export default router;
