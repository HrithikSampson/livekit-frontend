"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioWaveform, Bot } from "lucide-react";
import LivekitRoom from "@/components/LivekitRoom";

export default function Home() {
  return (
    <>
      <LivekitRoom/>
    </>
  );
}
