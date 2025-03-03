"use client";

import { useEffect, useRef, useState } from "react";

export default function VoiceVisualizer() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState("waveform");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!isRecording) return;

    const startAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      drawVisualization();
    };

    startAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, [isRecording, selectedPattern]);

  const drawVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const render = () => {
      if (!isRecording) return;
      requestAnimationFrame(render);

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (selectedPattern) {
        case "waveform":
          drawWaveform(ctx, canvas);
          break;
        case "bar-spectrum":
          drawBarSpectrum(ctx, canvas);
          break;
        case "circular-wave":
          drawCircularWave(ctx, canvas);
          break;
      }
    };
    render();
  };

  // 🔹 **Waveform Visualization**
  const drawWaveform = (ctx, canvas) => {
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceWidth = canvas.width / dataArrayRef.current.length;
    let x = 0;

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const v = dataArrayRef.current[i] / 128.0;
      const y = v * canvas.height / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  };

  // 🔹 **Bar Spectrum Visualization**
  const drawBarSpectrum = (ctx, canvas) => {
    const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
    let x = 0;
    ctx.fillStyle = "cyan";
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const barHeight = dataArrayRef.current[i] * 1.5;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  // 🔹 **Circular Wave Visualization**
  const drawCircularWave = (ctx, canvas) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) / 2;
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const angle = (i / dataArrayRef.current.length) * Math.PI * 2;
      const amp = dataArrayRef.current[i] / 255.0;
      const x = centerX + Math.cos(angle) * (radius + amp * 50);
      const y = centerY + Math.sin(angle) * (radius + amp * 50);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  return (
    <div
      className={`flex flex-col items-center p-8 min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-500 to-purple-700 text-black"
      }`}
    >
      {/* Title & Dark Mode Toggle */}
      <div className="flex flex-col items-center w-full max-w-2xl mb-4">
        <h1 className="text-4xl font-bold mb-6 shadow-md drop-shadow-lg text-center">Voice Visualizer</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg font-semibold shadow-md transition-all bg-gray-300 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Pattern Selection Buttons */}
      <div className="flex space-x-4 mb-6">
        {["waveform", "bar-spectrum", "circular-wave"].map((pattern) => (
          <button
            key={pattern}
            onClick={() => setSelectedPattern(pattern)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md transform hover:scale-105 hover:shadow-lg ${
              selectedPattern === pattern
                ? "bg-green-500 text-white ring-2 ring-green-300"
                : "bg-gray-300 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            {pattern.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Canvas Section */}
      <div
        className={`p-4 rounded-lg shadow-lg border-4 transition-all ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-black border-gray-500"
        }`}
      >
        <canvas ref={canvasRef} width={600} height={300} className="border rounded-lg"></canvas>
      </div>

      {/* Recording Button */}
      <button
        onClick={() => setIsRecording(!isRecording)}
        className={`mt-6 px-8 py-3 font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-300"
            : "bg-green-500 hover:bg-green-600 ring-2 ring-green-300"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
