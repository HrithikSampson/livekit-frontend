"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioWaveform, Bot } from "lucide-react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <>
      <div className="flex pt-10 w-full justify-center">
        <button className="relative block rounded-full border-8 border-amber-50" onClick={() => {
          
        }}>

          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-30"
            animate={{ scale: 1 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
          <Image
            className={twMerge("dark:invert","rounded-full")}
            src="/mic.jpg"
            alt="Microphone logo"
            width={300}
            height={180}
            priority
          />
        </button>
      </div>

      <div className="text-2xl font-bold text-gray-500 text-center mt-10">Human in the Loop<br/>AI Calling</div>
      <div className="flex flex-row justify-center gap-10 mt-16">
        <div className="flex flex-row items-center justify-center gap-4 mt-10">
          <div>
            <h1>Supervisor</h1>
          </div>
          <div className={twMerge("relative w-auto h-auto flex items-center justify-center")}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-30"
              animate={{ scale: 1 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full opacity-30"
            />
            <AudioWaveform
              className="text-blue-500"
              size={50}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 mt-10">
          <div>
            <h1>Livekit</h1>
          </div>
          <div className={twMerge("relative w-auto h-auto flex items-center justify-center")}>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-30"
              animate={{ scale: 1}}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full opacity-30"
            />
            <Bot
              className="text-blue-500 p-1"
              size={50}
            />
          </div>
        </div>
      </div>
    </>
  );
}
