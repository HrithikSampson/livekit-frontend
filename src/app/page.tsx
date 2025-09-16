"use client";
import LivekitRoom from "@/components/LivekitRoom";
import Link from "next/link";
import { Users } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Navigation Header */}
      <div className="w-full p-4 sm:p-6 flex-shrink-0">
        <div className="flex justify-end">
          <Link 
            href="/supervisor"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Users size={20} />
            <span className="hidden sm:inline">Supervisor</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <LivekitRoom/>
      </div>
    </div>
  );
}
