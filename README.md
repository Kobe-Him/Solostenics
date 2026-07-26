# ⚔️ Project Solostenics (The Savage System)

**Gamified, AI-Powered Physical Therapy.**

Welcome to the Solostenics MVP repository. This project is a hyper-gamified calisthenics and rehabilitation utility disguised as an RPG. It solves the "Compliance Crisis" in physical therapy by turning movement into an engaging game where users level up, equip gear, and defeat monsters—all tracked via their smartphone camera.

## 🚀 How to Run the App Locally

Judges, to test the AI tracking and the RPG UI on your own machine, please follow these 3 simple steps:

### Prerequisites
- You must have **Node.js** installed.

### 1. Install Dependencies
Clone this repository and run:
```bash
npm install
```

### 2. Set Up the Environment
This project requires a Gemini API key for some of the dynamic narrative elements. 
Create a `.env.local` file in the root directory and add your key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```
*(Note: If you do not have an API key, the core UI and MediaPipe tracking will still function).*

### 3. Start the Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎮 How to Test the Demo
1. Navigate through the **Game Lobby**. Check out the **Destiny-style Loadout**, the **Supply Depot**, and the **Skill Tree Progression**.
2. Click **ENTER DUNGEON**.
3. **Important:** Allow camera permissions when the browser asks.
4. Step back from your webcam so it can see your full body. The AI (Google MediaPipe) will map a skeleton over your body.
5. Do a **Push-Up**! The AI will track your form, and if you complete a rep with good form, it will deal damage to the Dungeon Monster on screen.

---

**Built for the Alibaba CoCreate Pitch Competition.**
*Transforming patients into players, one rep at a time.*
