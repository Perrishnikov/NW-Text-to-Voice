const synth = window.speechSynthesis;
let voices = [];

// Function to speak the text
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    const selectedVoiceIndex = document.getElementById('voiceSelect').value;
    utterance.voice = voices[selectedVoiceIndex];

    const rate = document.getElementById('rateRange').value;
    utterance.rate = parseFloat(rate);

    const volume = document.getElementById('volumeRange').value;
    utterance.volume = parseFloat(volume);

    synth.speak(utterance);
}

// Function to populate the list of voices
function populateVoiceList() {
    // voices = synth.getVoices().filter((voice) => voice.lang.startsWith('en-US'));
    voices = synth
        .getVoices()
        .filter((voice) => voice.name.startsWith('Samantha'));
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = ''; // Clear previous options

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        voiceSelect.appendChild(option);
    });

    // Trigger voice change event in case the voices were not loaded initially
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }
}

window.addEventListener('load', (e) => {
    // Add event listener to the button
    document.getElementById('speakTextButton').addEventListener('click', () => {
        const textToVoiceText =
            document.querySelector('#textToVoiceArea').value;
        if (textToVoiceText) {
            speak(textToVoiceText);
        }
    });

    // Add event listener to the textarea for Enter key press
    document
        .getElementById('textToVoiceArea')
        .addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent the default Enter behavior (line break)
                const textToVoiceText =
                    document.querySelector('#textToVoiceArea').value;
                if (textToVoiceText) {
                    speak(textToVoiceText);
                }
            }
        });

    // Display the current value of the rate input
    const rateRange = document.getElementById('rateRange');
    const rateValue = document.getElementById('rateValue');
    rateValue.textContent = rateRange.value;

    // Update the displayed value when the range input changes
    rateRange.addEventListener('input', () => {
        rateValue.textContent = rateRange.value;
    });

    // Display the current value of the rate input
    const volumeRange = document.getElementById('volumeRange');
    const volumneValue = document.getElementById('volumeValue');
    volumneValue.textContent = volumeRange.value;

    // Update the displayed value when the range input changes
    volumeRange.addEventListener('input', () => {
        volumneValue.textContent = volumeRange.value;
    });

    try {
        const parsedUrl = new URL(location.href);
        const voice = parsedUrl.searchParams.get('voice');
        if (voice) {
            const textToVoiceArea = document.querySelector('#textToVoiceArea');
            textToVoiceArea.innerText = voice;
        }

        populateVoiceList(synth);
    } catch (error) {
        const errorDiv = document.querySelector('#messageDiv');
        errorDiv.classList.add('error');
        errorDiv.textContent = `Error: ${error}`;
    }
});
