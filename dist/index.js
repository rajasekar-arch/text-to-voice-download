"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToVoice = textToVoice;
/**
 * Converts text to speech and attempts to return it as a downloadable audio Blob.
 *
 * IMPORTANT NOTE:
 * Due to browser security and API design limitations, it is NOT possible to directly
 * capture the audio output of `window.speechSynthesis.speak()` into a `MediaRecorder`
 * using standard Web Audio API methods.
 *
 * This function's `MediaRecorder` will capture a silent audio blob because the
 * SpeechSynthesis output cannot be routed into the AudioContext's MediaStreamDestination.
 *
 * For obtaining a downloadable audio Blob of synthesized speech, the recommended approach
 * is to use a server-side Text-to-Speech (TTS) API (e.g., Google Cloud Text-to-Speech)
 * which can generate and provide the audio file directly.
 *
 * @param text The text to convert to speech.
 * @param audioType Optional MIME type (default: 'audio/webm').
 * @returns Promise that resolves to a Blob of the spoken audio (will be silent from SpeechSynthesis).
 */
async function textToVoice(text, audioType = 'audio/webm') {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            return reject(new Error('SpeechSynthesis API is not supported in this browser.'));
        }
        // Check if the requested audio type is supported. Fallback to 'audio/webm' if not.
        if (!MediaRecorder.isTypeSupported(audioType)) {
            console.warn(`${audioType} not supported by MediaRecorder. Falling back to audio/webm.`);
            audioType = 'audio/webm';
        }
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        // Create an AudioContext. This is correctly initialized.
        const audioContext = new AudioContext();
        // Create a MediaStreamDestination node. This node will output audio from the AudioContext
        // into a MediaStream, which MediaRecorder can then capture.
        const destination = audioContext.createMediaStreamDestination();
        const mediaStream = destination.stream; // This stream is what MediaRecorder will record.
        // Initialize MediaRecorder with the stream from the AudioContext destination.
        const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: audioType });
        const chunks = []; // Array to store audio data chunks
        // Event handler for when audio data is available from MediaRecorder
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        // Event handler for when MediaRecorder stops
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: audioType });
            resolve(audioBlob);
            audioContext.close(); // Close the AudioContext when done
        };
        // This `onstart` handler for the utterance is where the core issue lies.
        // There is no direct way to connect the SpeechSynthesis output to the AudioContext.
        utterance.onstart = () => {
            mediaRecorder.start();
        };
        utterance.onend = () => {
            mediaRecorder.stop();
        };
        // Error handler for speech synthesis
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance error:', event);
            mediaRecorder.stop(); // Ensure recorder stops on error
            audioContext.close();
            reject(new Error(`Speech synthesis failed: ${event.error}`));
        };
        try {
            // Start the speech synthesis.
            // This will play audio directly to the user's default output device.
            synth.speak(utterance);
        }
        catch (error) {
            console.error('Error calling synth.speak():', error);
            reject(error);
        }
    });
}
