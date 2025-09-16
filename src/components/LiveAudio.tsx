"use client";
import {
  ControlBar,
  RoomAudioRenderer,
  useTracks,
  useTrackVolume,
} from '@livekit/components-react';
import { twMerge } from "tailwind-merge";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AudioWaveform, Bot } from "lucide-react";
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import Image from "next/image";
  


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
//     <GridLayout tracks={tracks as any}>
//       {/* The GridLayout accepts zero or one child. The child is used
//           as a template to render all passed in tracks. */}
//       <ParticipantTile>
//         <AudioTrack trackRef={trackRef} />
//       </ParticipantTile>
//     </GridLayout>
//   );
// }
export default function LiveAudio({room}: {room: Room}) {
  const allMicTracks = useTracks(
    [{ source: Track.Source.Microphone, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  const trackSupervisor = allMicTracks.find(t => t.participant.identity === `${room.name}-supervisor`);
  // const trackBot = allMicTracks.find(t => t.participant.identity === `${room.name}-bot`);
  const volumeSupervisor = useTrackVolume({ participant: trackSupervisor?.participant });

  
  // Debug logging
  console.log('Room name:', room.name);
  console.log('Room state:', room.state);
  console.log('Room participants count:', room.numParticipants);
  console.log('All mic tracks:', allMicTracks.map(t => ({ identity: t.participant.identity, enabled: t.participant.isMicrophoneEnabled })));
  console.log('Supervisor track found:', !!trackSupervisor);
  console.log('Supervisor volume:', volumeSupervisor);
  console.log('Active speakers:', room.activeSpeakers.map(s => ({ identity: s.identity, audioLevel: s.audioLevel })));
  
  const supervisorParticipant = room.remoteParticipants.get(`${room.name}-supervisor`);
  console.log('Supervisor participant found:', !!supervisorParticipant);
  if (supervisorParticipant) {
    console.log('Supervisor mic enabled:', supervisorParticipant.isMicrophoneEnabled);
  }
  
  // Get supervisor volume from active speakers as well for better detection
  const supervisorVolume = room.activeSpeakers.reduce((a, part) => {
    if (part.identity === `${room.name}-supervisor`) {
      return a + part.audioLevel;
    }
    return a;
  }, 0);
  
  // Use the higher of the two volume sources for supervisor
  const finalSupervisorVolume = Math.max(volumeSupervisor || 0, supervisorVolume);
  
  const volumeBot = room.activeSpeakers.reduce((a,part)=>{
    return a + (part.isAgent?part.audioLevel:0);
  },0);
  const [isRecording, setIsRecording] = useState(false);
  const trackVolume = room.localParticipant.audioLevel;
  
  return (
    <div className="h-screen flex flex-col justify-between max-w-6xl mx-auto px-4">
      {/* Top Section - Microphone and Title */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-4">
        <div className="flex justify-center">
          <button className="relative block rounded-full border-4 sm:border-6 lg:border-8 border-amber-50 hover:border-amber-100 transition-colors duration-200" onClick={async () => {
            if (room.state !== "connected") {
              console.log("Room not connected");
              return;
            }
            await room.localParticipant.setMicrophoneEnabled(!isRecording);
            setIsRecording(!isRecording);
          }}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-30"
              animate={{ scale: 1 + trackVolume * 2 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            <Image
              className={twMerge("dark:invert","rounded-full w-[120px] h-[72px] sm:w-[150px] sm:h-[90px] lg:w-[200px] lg:h-[120px]")}
              src="/mic.jpg"
              alt="Microphone logo"
              width={200}
              height={120}
              priority
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 200px"
            />
          </button>
        </div>

        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 text-center">
          Human in the Loop<br/>AI Calling
        </div>
      </div>

      {/* Middle Section - Status Indicators */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 lg:gap-10 py-4">
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-sm sm:text-base font-medium">Supervisor</h1>
          </div>
          <div className={twMerge("relative w-auto h-auto flex items-center justify-center p-2")}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-40"
              animate={{ scale: 1 + finalSupervisorVolume * 3 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full opacity-30"
              animate={{ scale: 1 + finalSupervisorVolume * 1.5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <AudioWaveform
              className="text-blue-500 relative z-10"
              size={40}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-sm sm:text-base font-medium">Livekit</h1>
          </div>
          <div className={twMerge("relative w-auto h-auto flex items-center justify-center p-2")}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-40"
              animate={{ scale: 1 + volumeBot * 3 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full opacity-30"
              animate={{ scale: 1 + volumeBot * 1.5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <Bot
              className="text-blue-500 p-1 relative z-10"
              size={40}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Audio Controls */}
      <div data-lk-theme="default" className="w-full h-[200px] sm:h-[250px] lg:h-[300px] flex-shrink-0">
        <RoomAudioRenderer />
        <ControlBar controls={{microphone: true, camera: false , screenShare: false}} />
      </div>
    </div>
  );
}