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
export declare function textToVoice(text: string, audioType?: 'audio/webm' | 'audio/ogg'): Promise<Blob>;
