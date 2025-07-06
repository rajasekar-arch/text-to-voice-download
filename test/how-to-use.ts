import { textToVoice } from '../src/frontend';

async function handleDownload() {
  const blob = await textToVoice("Hello world!", 'audio/wav');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voice.wav';
  a.click();
}

handleDownload();