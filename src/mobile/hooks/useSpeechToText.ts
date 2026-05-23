import { useState, useEffect, useCallback, useRef } from 'react';
import * as SpeechRecognition from 'expo-speech-recognition';

interface SpeechResult {
  transcript: string;
  isFinal: boolean;
}

interface UseSpeechToTextReturn {
  text: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  error: string | null;
}

export const useSpeechToText = (
  language: string = 'zh-CN'
): UseSpeechToTextReturn => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const checkSupport = async () => {
      try {
        const available = await SpeechRecognition.isAvailable();
        setIsSupported(available);
      } catch {
        setIsSupported(false);
      }
    };
    checkSupport();
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const subscription = SpeechRecognition.onResult((result: SpeechResult) => {
      setTranscript(result.transcript);
    });

    return () => {
      subscription.remove();
    };
  }, [isSupported]);

  // Sync transcript to text
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      setError(null);
      setIsListening(true);
      setText('');
      setTranscript('');

      await SpeechRecognition.start({
        language,
        continuous: true,
        interimResults: true,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to start');
      setIsListening(false);
    }
  }, [isSupported, language]);

  const stopListening = useCallback(async () => {
    try {
      await SpeechRecognition.stop();
      setIsListening(false);
    } catch (e: any) {
      setError(e.message || 'Failed to stop');
    }
  }, []);

  return {
    text,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error,
  };
};