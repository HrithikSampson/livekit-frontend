
import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { db } from '@/utils/firebase';
import { RequestEnum } from '@/utils/requestEnum';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { participantName, roomName } = await req.json();
    
    // Validate inputs
    if (!participantName || !roomName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Missing LIVEKIT credentials' }, { status: 500 });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '10m',
    });

    token.addGrant({ roomJoin: true, room: roomName });

    const jwt = await token.toJwt();

    try {
      const docRef = db.collection("rooms").doc(roomName);
      
      await docRef.set({
        userId: participantName,
        roomName,
        request: RequestEnum.START,
      });
      
      console.log(`Successfully set document for room: ${roomName}`);
    } catch (firestoreError) {
      console.error('Firestore error details:', firestoreError);
    }
    
    return NextResponse.json({ token: jwt });
  } catch (error) {
    console.error('Token creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create token',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}