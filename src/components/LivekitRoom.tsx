"use client";
import {
  RoomContext,
} from '@livekit/components-react';

import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import '@livekit/components-styles';
import { v4 as uuidv4 } from 'uuid';
import LiveAudio from './LiveAudio';

const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL as string;
if (!serverUrl) throw new Error('NEXT_PUBLIC_LIVEKIT_URL missing at build time');
// function MyVideoConference() {
//   // `useTracks` returns all camera and screen share tracks. If a user
//   // joins without a published camera track, a placeholder track is returned.
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Microphone, withPlaceholder: true },
//     ],
//     { onlySubscribed: false },
//   );
//   const trackRef = useEnsureTrackRef();
//   return (
//     <GridLayout tracks={tracks}>
//       {/* The GridLayout accepts zero or one child. The child is used
//         as a template to render all passed in tracks. */}
//       <ParticipantTile>
//         <AudioTrack trackRef={trackRef} />
//       </ParticipantTile>
//     </GridLayout>
//   );
// }
export default function LivekitRoom({roomName}: {roomName?: string}) {
  const [room] = useState(() => {
    return new Room({
      adaptiveStream: true,
      dynacast: true,
    })
  });
  
  useEffect(() => {
    let mounted = true;
    const currentRoomName = roomName || uuidv4();
    
    const token = async () => {
      // Check if we have a cached token and if it's still valid
      const cachedToken = localStorage.getItem("call_gpt_token");
      if (cachedToken) {
        try {
          // Parse JWT to check expiration
          const payload = JSON.parse(atob(cachedToken.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp > now) {
            return cachedToken; // Token is still valid
          }
        } catch (e: any) {
          console.log('Invalid cached token, generating new one',e.message);
        }
        // Remove expired token
        localStorage.removeItem("call_gpt_token");
      }
      const response = await fetch('/api/createToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: `${currentRoomName}-user`,
          roomName: currentRoomName,
        }),
      });
      
      if (!response.ok) {
        console.error('Token creation failed:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        throw new Error(`Failed to create token: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.token) {
        console.error('No token received from server:', data);
        throw new Error('No token received from server');
      }
      
      localStorage.setItem("call_gpt_token", data.token);
      return data.token;
    };
    const connect = async () => {
      if (mounted) {
        try {
          const authToken = await token();
          if (!authToken) {
            console.error("Failed to get authentication token");
            return;
          }
          await room.connect(serverUrl, authToken);
          console.log("Connected to room", currentRoomName);
          
          // Request microphone permission after connection
          try {
            await room.localParticipant.setMicrophoneEnabled(true);
            console.log("Microphone enabled");
          } catch (micError) {
            console.warn("Could not enable microphone:", micError);
          }
        } catch (error) {
          console.error("Failed to connect to room:", error);
        }
      }
    };
    connect();
  
    return () => {
      mounted = false;
      room.disconnect();
    };
  }, [room, roomName]);
  
  return (
    <RoomContext.Provider value={room}>
      <LiveAudio room={room} />
    </RoomContext.Provider>
  );
}
