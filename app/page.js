"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch uploaded files when the page loads
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/uploaded-files/");
        setUploadedFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:8000/upload-audio/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload successful!");
      setSelectedFile(null);

      // Refresh uploaded files list
      const response = await axios.get("http://localhost:8000/uploaded-files/");
      setUploadedFiles(response.data);
    } catch (error) {
      setMessage("Upload failed. Check the backend.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Audio App</h1>
      
      <div className="grid grid-cols-1 gap-6 w-80 mb-8">
        <Link href="/voice-visualizer">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 w-full">
            🎤 Go to Voice Visualizer
          </button>
        </Link>
        
        <button className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-lg w-full cursor-not-allowed">
          🚧 Feature Placeholder 1
        </button>
        
        <button className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-lg w-full cursor-not-allowed">
          🚧 Feature Placeholder 2
        </button>
      </div>
      
      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          className="mb-4 w-full border p-2 rounded text-gray-900"
        />
        <button 
          onClick={handleUpload} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
      
      <hr className="w-96 my-6 border-gray-400" />
      
      {/* Uploaded Files Section */}
      <h2 className="text-xl font-semibold mb-3 text-gray-900">Uploaded Files</h2>
      {uploadedFiles.length === 0 ? (
        <p className="text-gray-700">No files uploaded yet.</p>
      ) : (
        <ul className="bg-white p-6 rounded-lg shadow-md w-96 text-gray-900">
          {uploadedFiles.map((file) => (
            <li key={file.id} className="flex justify-between items-center border-b py-2">
              <span className="text-gray-900">🎵 {file.filename}</span>
              <a 
                href={`http://localhost:8000/${file.filepath}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
