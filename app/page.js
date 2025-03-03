"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-6 text-white">
      <h1 className="text-4xl font-bold mb-10 shadow-md">Welcome to the WaveSync App</h1>
      
      <div className="grid grid-cols-1 gap-6 w-80">
        <Link href="/voice-visualizer">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 w-full font-semibold transition-all">
            🎤 Go to Voice Visualizer
          </button>
        </Link>
        
        <button className="bg-white text-gray-600 px-6 py-3 rounded-lg shadow-lg w-full font-semibold cursor-not-allowed opacity-70">
          🚧 Feature Placeholder 1
        </button>
        
        <button className="bg-white text-gray-600 px-6 py-3 rounded-lg shadow-lg w-full font-semibold cursor-not-allowed opacity-70">
          🚧 Feature Placeholder 2
        </button>
      </div>
    </div>
  );
}
