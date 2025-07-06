# **`text-to-voice-download` \- Text-to-Voice Converter & Downloader (Frontend)**

A TypeScript-first npm package designed for converting text into downloadable audio files, seamlessly integrating into your frontend (browser) applications.

## **✨ Features**

* **Customizable Voice & Audio:** audio output format (MP3, WAV, OGG, etc.).  
* **Direct Browser Download:** Simple utility for triggering audio file downloads directly in the user's browser.  
* **TypeScript Ready:** Fully type-safe with comprehensive type definitions for a robust development experience.

## **🚀 Installation**

Install the package using npm or yarn:

npm install text-to-voice-download  
\# or  
yarn add text-to-voice-download

## **🛠️ Usage**

This package provides functions to convert text to audio and initiate downloads directly in the browser.

### **Core Functions for Frontend Use**

#### **`textToVoice(text: string, audioType?: 'audio/webm' | 'audio/wav' | 'audio/ogg'): Promise<Blob>`**

This is the primary function responsible for converting your text into a downloadable audio Blob using the browser's native Text-to-Speech capabilities.

* `text`: The string of text you want to convert to speech.  
* `audioType`: (Optional) The desired MIME type for the audio file. Supported types are `'audio/webm'`, `'audio/wav'`, or `'audio/ogg'`. Defaults to `'audio/webm'`.  
* **Returns:** A `Promise` that resolves with an `Blob` object. This Blob can then be used to create a downloadable link or played directly in the browser.

## **🤝 Contributing**

Contributions are welcome\! If you have suggestions for improvements, new features, or bug fixes, please open an issue or submit a pull request.

1. Fork the repository.  
2. Create your feature branch (`git checkout -b feature/Production`).  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).  
4. Push to the branch (`git push origin feature/Production`).  
5. Open a Pull Request.

## **📄 License**

Distributed under the MIT License. See `LICENSE` for more information.

