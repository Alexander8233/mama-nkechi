# Mama Nkechi: AI market trader (Speko voice demo)

Haggle by voice with Mama Nkechi, a Lagos market trader, and see how low you can get the price.

---

## 1. Create the agent in Speko (no code)

1. On platform.speko.ai, skip the phone-number step.
2. Go to **Agents → Create agent** and paste in the name, first message and system prompt (see `AGENT_PROMPT.md`).
3. Save, then use Speko's **test/talk** button to check her voice.
4. Click **Deploy** so the live version is used.
5. Create an **API key** (from **API keys** in the dashboard). The Agent ID is already filled in for you.

Keep the API key private: don't post it, screenshot it or share it.

## 2. Install Node.js (one time)

1. Go to **nodejs.org** and download the **LTS** version.
2. Install it with the default options.
3. Check it worked: open **Command Prompt** (Windows) or **Terminal** (Mac) and type:
   ```
   node -v
   ```
   You should see a version number like `v22.x.x`.

## 3. Run the app

1. Unzip this folder somewhere easy, such as your Desktop.
2. In the folder, make a copy of `.env.example` and name it **`.env`**.
   (On Windows, if you can't see file extensions, open Notepad, paste the lines and use **Save as** → file name `.env` → "All files".)
3. Open `.env` and paste in your values:
   ```
   SPEKO_API_KEY=your-api-key
   SPEKO_AGENT_ID=your-agent-id
   ```
4. Open Command Prompt or Terminal **in the folder**. On Windows, click the address bar in File Explorer, type `cmd` and press Enter.
5. Start it:
   ```
   node server.js
   ```
6. Open **http://localhost:3000** in Chrome, press **Start haggling**, and allow the microphone.

To preview the design without Speko, open **http://localhost:3000/?demo=1**.

Stop the app with **Ctrl + C** in the terminal.

## If something goes wrong

- **"Add SPEKO_API_KEY and SPEKO_AGENT_ID"**: your `.env` file is missing or misnamed (it must be `.env`, not `.env.txt`).
- **"Speko returned 401/403"**: the API key is wrong or expired. Make a new one.
- **"Speko returned 404"**: the Agent ID is wrong, or the agent isn't deployed yet.
- **Any other Speko error**: the terminal prints Speko's full reply. Copy it and send it to me.
- **No sound or mic**: use Chrome, allow the microphone, and check your speakers.

## Recording the video

- Use **Loom**, or **Win + Alt + R** (Xbox Game Bar) on Windows, to record the browser tab **with system audio**, so viewers hear Mama Nkechi.
- Wear earphones while recording so her voice doesn't echo back into your mic.
- Keep it 30–60 seconds: hook, haggle, the DEAL screen.

## Put it online (GitHub + Vercel)

1. On GitHub, create a new repository, e.g. `mama-nkechi`.
2. Upload these files and folders: `api`, `public`, `package.json`, `vercel.json`, `README.md`, `AGENT_PROMPT.md`, `server.js`, `.env.example`.
   **Do NOT upload `.env`.** It contains your secret key.
3. On vercel.com, click **Add New → Project** and import the `mama-nkechi` repository.
4. Before clicking Deploy, open **Environment Variables** and add:
   - `SPEKO_API_KEY` = your Speko API key
   - `SPEKO_AGENT_ID` = agent_f7e6fcfb7a8b45ea
5. Click **Deploy**. You'll get a link like `mama-nkechi.vercel.app`.

Each haggle is capped at 3 minutes to protect your Speko credits. Check your credit balance in Speko, and pause the project in Vercel after the challenge if you want to stop usage.
