import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { RequestEnum } from '@/utils/requestEnum';

export async function GET() {
  try {
    console.log('Fetching pending rooms...');
    
    const docRef = await db.collection('rooms')
      .where('request', '==', RequestEnum.PENDING)
      .get();

    if (docRef.empty) {
      console.log('No pending rooms found');
      return NextResponse.json({ rooms: [] });
    }

    const rooms = docRef.docs.map(doc => ({
      id: doc.id,
      roomName: doc.id,
      ...doc.data()
    }));

    console.log(`Number of Pending Rooms: ${rooms.length}`);
    console.log('Pending rooms data:', rooms);
    
    return NextResponse.json({ rooms });
    
  } catch (error) {
    console.error('Error fetching pending rooms:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch pending rooms',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}