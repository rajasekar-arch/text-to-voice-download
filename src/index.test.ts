import { textToVoice } from "./index";

describe("textToVoice", () => {
    const mockSpeak = jest.fn();
    const mockSynthesis: Partial<SpeechSynthesis> = {
        speak: mockSpeak,
    };

    const mockUtteranceInstance: Partial<SpeechSynthesisUtterance> = {};
    const mockUtterance = jest.fn().mockImplementation((text: string) => {
        return {
            text,
            onstart: jest.fn(),
            onend: jest.fn(),
            ...mockUtteranceInstance,
        };
    });

    let ondataavailableHandler: (event: any) => void;
    let onstopHandler: () => void;

    const mockStart = jest.fn();
    const mockStop = jest.fn();

    const mockMediaRecorder = jest.fn().mockImplementation(() => ({
        start: mockStart,
        stop: mockStop,
        ondataavailable: jest.fn().mockImplementation((fn) => {
            ondataavailableHandler = fn;
        }),
        onstop: jest.fn().mockImplementation((fn) => {
            onstopHandler = fn;
        }),
    }));

    const mockAudioContext = jest.fn().mockImplementation(() => ({
        createMediaStreamDestination: () => ({
            stream: {} as MediaStream,
        }),
        createMediaStreamSource: () => ({
            connect: jest.fn(),
        }),
        destination: {} as AudioDestinationNode,
        close: jest.fn(),
    }));

    beforeAll(() => {
        // @ts-ignore
        global.window.speechSynthesis = mockSynthesis;
        // @ts-ignore
        global.SpeechSynthesisUtterance = mockUtterance;
        // @ts-ignore
        global.MediaRecorder = mockMediaRecorder;
        // @ts-ignore
        global.AudioContext = mockAudioContext;
    });

    it("should resolve with a Blob when speech synthesis completes", async () => {
        const blobData = new Blob(["audio data"], { type: "audio/webm" });

        const promise = textToVoice("Hello world");

        // Simulate data being available
        ondataavailableHandler?.({ data: blobData });

        // Simulate media recorder stop
        onstopHandler?.();

        const result = await promise;

        expect(result).toBeInstanceOf(Blob);
        expect(result.size).toBeGreaterThan(0);
        expect(mockSpeak).toHaveBeenCalled();
        expect(mockStart).toHaveBeenCalled();
        expect(mockStop).toHaveBeenCalled();
    });

    it("should reject if speech synthesis is not supported", async () => {
        // @ts-ignore
        delete global.window.speechSynthesis;

        await expect(textToVoice("Hi")).rejects.toThrow(
            "SpeechSynthesis API is not supported in this browser."
        );

        // restore
        // @ts-ignore
        global.window.speechSynthesis = mockSynthesis;
    });
});
