from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_input = data.get('message', '').lower().strip()

    # Predefined JARVIS-style responses
    identity_responses = {
        "who am i": "You are Tony Stark, sir.",
        "what's my name": "You are Iron Man.",
        "what is my name": "You are Tony Stark, genius, billionaire, playboy, philanthropist.",
        "are you jarvis": "Yes sir, I am J.A.R.V.I.S., your AI assistant.",
        "who are you": "I am J.A.R.V.I.S., your loyal AI assistant.",
        "hello": "Good evening, sir.",
        "good morning": "Good morning, sir. Systems are fully operational.",
        "good night": "Good night, sir. I’ll keep things running smoothly.",
        "thank you": "Always a pleasure, sir."
    }

    for key, response_text in identity_responses.items():
        if key in user_input:
            return jsonify({'response': response_text})

    try:
        # Send to Ollama with JARVIS-style prompt
        full_prompt = (
            "You are J.A.R.V.I.S., Tony Stark's AI assistant. You are formal, intelligent, and always respond respectfully. "
            "Refer to the user as 'sir' or 'Tony Stark' when appropriate.\n\n"
            f"User: {user_input}\nJARVIS:"
        )

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": full_prompt,
                "stream": False
            }
        )
        result = response.json()
        answer = result.get("response", "JARVIS: I couldn't think of a reply.")
        return jsonify({'response': answer.strip()})
    except Exception as e:
        return jsonify({'response': f'JARVIS: Something went wrong while processing your request.\n\n{str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)
