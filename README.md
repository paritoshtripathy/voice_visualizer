# Project Overview
This project consists of a **FastAPI backend** and a **Next.js frontend**. The backend handles file uploads and stores metadata in a MySQL database, while the frontend provides an interface for users to upload audio files and visualize voice waveforms.

---

## Backend (FastAPI)

### **1️⃣ Setup & Run Backend**
#### **Prerequisites:**
- Python 3.9+
- Docker (for MySQL)

#### **Steps to Run**
1. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Start MySQL in Docker:**
   ```bash
   docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=rootpassword \
       -e MYSQL_DATABASE=mydatabase -e MYSQL_USER=user -e MYSQL_PASSWORD=password \
       -p 3306:3306 -d mysql:8
   ```
4. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
5. **Test API in Browser/Postman:**
   - Open `http://localhost:8000/docs` for API documentation.
   - Upload a file via `POST /upload-audio/`
   - Fetch uploaded files via `GET /uploaded-files/`

---

## Frontend (Next.js)

### **2️⃣ Setup & Run Frontend**
#### **Prerequisites:**
- Node.js 18+
- npm or yarn

#### **Steps to Run**
1. **Navigate to frontend directory:**
   ```bash
   cd myapp-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```
4. **Open the frontend in your browser:**
   - `http://localhost:3000/` → Audio Upload UI
   - `http://localhost:3000/voice-visualizer` → Voice Visualization UI

---

## Features
✅ Upload audio files from frontend to FastAPI backend
✅ Store file metadata in MySQL
✅ List uploaded files with download links
✅ Visualize real-time voice waveforms using Web Audio API
✅ Navigate between upload and visualization pages

---

## Next Steps
- 🎨 Improve UI with better animations and styles
- 📊 Enhance waveform visualization with frequency analysis
- 🎤 Enable real-time voice recording and streaming

