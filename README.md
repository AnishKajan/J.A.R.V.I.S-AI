# J.A.R.V.I.S-AI
J.A.R.V.I.S is an Iron Man–themed AI assistant that uses Python, Flask, and Ollama's local LLMs. With voice control, speech output, and a custom UI, it responds to commands prefaced with “Jarvis” and answers in character as if you're Tony Stark.


## Features

- **Voice Recognition:** Say "Jarvis" followed by a question or command
- **In-Character Responses:** Personalized as if you're Iron Man
- **Local LLM Integration:** Uses Ollama + Mistral for private, fast response
- **Custom UI:** Glowing red theme, Iron Man SVG, and live response chatbox
- **Speech Output:** Reads replies aloud unless muted

## Structure

JARVIS-MARVEL
├── engine/ # Reserved for future backend logic
├── node_modules/ # Node dependencies (if extended with frontend tooling)
├── venv/ # Python virtual environment
├── www/
│ ├── assets/
│ │ └── vendore/ # Optional asset subfolders
│ │ └── iron-man-logo.svg
│ ├── index.html # Frontend UI
│ ├── main.js # Handles speech input/output and API calls
│ └── style.css # Neon red Iron Man theme styles
├── .env # Environment variables (optional)
├── main.py # Flask backend that connects to Ollama
└── README.md # You are here
