/**
 * Converts text to speech and returns it as a downloadable audio Blob.
 * @param text The text to convert to speech.
 * @param audioType Optional MIME type (default: 'audio/webm').
 * @returns Promise that resolves to a Blob of the spoken audio.
 */
export declare function textToVoice(text: string, audioType?: 'audio/webm' | 'audio/wav' | 'audio/ogg'): Promise<Blob>;
