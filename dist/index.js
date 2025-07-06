"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToVoice = textToVoice;
/**
 * Converts text to speech and returns it as a downloadable audio Blob.
 * @param text The text to convert to speech.
 * @param audioType Optional MIME type (default: 'audio/webm').
 * @returns Promise that resolves to a Blob of the spoken audio.
 */
async function textToVoice(text, audioType = 'audio/webm') {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            return reject(new Error('SpeechSynthesis API is not supported in this browser.'));
        }
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const mediaStream = destination.stream; // Correct usage here
        const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: audioType });
        const chunks = [];
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: audioType });
            resolve(audioBlob);
        };
        utterance.onstart = () => {
            const source = audioContext.createMediaStreamSource(destination.stream);
            source.connect(destination); // Connect to our recording destination
            source.connect(audioContext.destination); // Also connect to actual output (speaker)
            mediaRecorder.start();
        };
        utterance.onend = () => {
            mediaRecorder.stop();
            audioContext.close();
        };
        synth.speak(utterance);
    });
}
