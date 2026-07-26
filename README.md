# Project Solostenics - Technical Setup & Testing Guide

This repository contains the MVP for Project Solostenics. Follow the instructions below to run the application locally and test the AI tracking features.

## 🚀 How to Run the App Locally

### Prerequisites
- **Node.js** must be installed on your machine.

### 1. Install Dependencies
Clone this repository and run the following command in the root directory:
```bash
npm install
```

### 2. Set Up the Environment
This project requires a Gemini API key for some of the dynamic narrative elements. 
Create a `.env.local` file in the root directory and add your key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```
*(Note: If you do not have an API key, the core UI and MediaPipe tracking will still function normally).*

### 3. Start the Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎮 How to Test the Demo
1. Navigate through the **Game Lobby** to view the **Loadout**, **Supply Depot**, and **Skill Tree Progression**.
2. Click **ENTER DUNGEON**.
3. **Important:** Allow camera permissions when the browser prompts you.
4. Step back from your webcam so it can see your full body. The Google MediaPipe AI will map a tracking skeleton over you.
5. Do a **Push-Up**. The AI will track your form, count your reps, and deal damage to the Dungeon Monster on screen when a proper rep is completed.
