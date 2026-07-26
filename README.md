# Welcome to the Solostenics MVP! 👋

**🔥 Live Interactive Demo:** [https://solostenics.vercel.app](https://solostenics.vercel.app)

Hello! Thank you so much for taking the time to review the Solostenics MVP. 

This is a working prototype of our gamified physical therapy app. If you just want to test it immediately, click the **Live Interactive Demo** link above! 

If you want to evaluate the source code and run it locally, we've made this as easy and friendly as possible. Here is exactly how you can get this running on your own computer in about 2 minutes:

## 🛠️ Step 1: Getting Ready
To run this, your computer just needs a standard program called **Node.js**. 
*If you don't already have it, you can download it safely and quickly here:* [Download Node.js](https://nodejs.org/) *(Just click the recommended version and install it like any normal app).*

## 💻 Step 2: Starting the App
1. Open a **Terminal** on your computer. 
   * **On Mac:** Press `Cmd + Space`, type "Terminal", and hit Enter.
   * **On Windows:** Press the Windows key, type "cmd", and hit Enter.
2. In your terminal, navigate to the folder where you downloaded this project.
3. Type the following command and press Enter (this downloads the required files):
   ```bash
   npm install
   ```
4. Once that finishes, type this command and press Enter (this turns the app on!):
   ```bash
   npm run dev
   ```
5. Finally, open your web browser (like Google Chrome or Safari) and go to this exact address:
   **http://localhost:5173**

---

## 🎮 Step 3: Playing the Game!
Now that you are in the app, here is how you can test the AI tracking:
1. **Look Around:** Click through the Game Lobby. Check out the Destiny-style Loadout, the Shop, and the Skill Tree.
2. **Start a Mission:** Click the big **ENTER DUNGEON** button.
3. **Turn on the Camera:** Your browser will ask for permission to use your webcam. Please click "Allow".
4. **Get in Position:** Stand up and step back from your computer so the webcam can see your whole body. Our AI (Google MediaPipe) will instantly draw a tracking skeleton over your joints.
5. **Do a Push-Up!** Drop down and do a push-up. The AI will evaluate your form in real-time, count your rep, and deal damage to the monster on your screen!

Thank you again for your time and for reviewing Solostenics!
