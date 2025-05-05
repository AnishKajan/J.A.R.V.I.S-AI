const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-button');
const doneBtn = document.getElementById('done-button');
const muteBtn = document.getElementById('mute-button');
const chatWindow = document.getElementById('chat-window');
const body = document.body;

const synth = window.speechSynthesis;
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = recognition ? new recognition() : null;

let isMuted = false;
let allowRecognition = true;
let allowResponse = true;

if (recognizer) {
    recognizer.lang = 'en-US';
    recognizer.continuous = true;
    recognizer.interimResults = true;

    recognizer.onresult = (event) => {
        if (!allowRecognition) return;

        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
            .trim();

        const isFinal = event.results[event.results.length - 1].isFinal;

        if (transcript.toLowerCase().startsWith("jarvis")) {
            if (isFinal) {
                const command = transcript.substring(6).trim();
                input.value = command;
                sendMessage();
            }
        } else {
            input.value = '';
        }
    };

    recognizer.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognizer.onend = () => {
        if (allowRecognition) recognizer.start();
    };

    recognizer.start();
}

sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMessage();
});

doneBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '';
    input.value = '';
    doneBtn.classList.remove('show');
    body.classList.remove('blurred');
    allowResponse = false;
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;

    if (isMuted) {
        muteBtn.textContent = 'Unmute';
        muteBtn.style.backgroundColor = 'yellow';
        muteBtn.style.color = 'black';
    } else {
        muteBtn.textContent = 'Mute';
        muteBtn.style.backgroundColor = 'red';
        muteBtn.style.color = 'white';
    }

    if (synth && synth.speaking) {
        synth.cancel();
    }
});

function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    const lowerMessage = message.toLowerCase();
    allowResponse = true;

    const triggers = ["search up", "look up", "google", "open a new tab and go to", "search for"];
    for (const trigger of triggers) {
        if (lowerMessage.startsWith(trigger)) {
            const query = message.substring(trigger.length).trim();
            if (query) {
                const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(url, "_blank");
                addMessage('computer', `Searching for "${query}"...`);
                doneBtn.classList.add('show');
                return;
            }
        }
    }

    addMessage('user', message);
    input.value = '';
    body.classList.add('blurred');
    doneBtn.classList.add('show');

    fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
        .then(response => response.json())
        .then(data => {
            if (!allowResponse) return;
            const cleanedResponse = data.response.replace(/^Computer:\s*/i, '');
            addMessage('computer', cleanedResponse);
            if (!isMuted) speakText(cleanedResponse);
            body.classList.remove('blurred');
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('computer', 'Something went wrong while processing your request.');
            body.classList.remove('blurred');
        });
}

function addMessage(type, text) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function speakText(text) {
    if (!synth) return;

    allowRecognition = false;
    if (recognizer && recognizer.stop) recognizer.stop();

    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utter.voice = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang === 'en-US');

    utter.onend = () => {
        allowRecognition = true;
        if (recognizer && recognizer.start && !isMuted) recognizer.start();
    };

    synth.speak(utter);
}
