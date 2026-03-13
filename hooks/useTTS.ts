import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

export interface Voice {
  id: string;
  name: string;
  lang: string;
  engine?: 'web' | 'native';
  nativeVoice?: any;
}

export interface TTSHook {
  voices: Voice[];
  selectedVoice: Voice | null;
  setVoice: (voice: Voice) => void;
  isPlaying: boolean;
  currentWordIndex: number;
  currentSentenceIndex: number;
  play: (sentences: string[], startSentence?: number, startWord?: number) => void;
  pause: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBack: () => void;
  speed: number;
  setSpeed: (rate: number) => void;
  pitch: number;
  setPitch: (p: number) => void;
}

type WebUtterance = SpeechSynthesisUtterance & {
  _sentenceIndex?: number;
};

export function useTTS(): TTSHook {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const sentencesRef = useRef<string[]>([]);
  const webUtteranceRef = useRef<WebUtterance | null>(null);
  const androidTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pitchRef = useRef(1);

  const hasInitializedVoices = useRef(false);

  useEffect(() => {
    async function loadNativeVoices() {
      try {
        const v = await Speech.getAvailableVoicesAsync();
        const mapped: Voice[] = v.map((voice) => ({
          id: voice.identifier || `${voice.language}:${voice.name}`,
          name: voice.name,
          lang: voice.language,
          engine: 'native',
          nativeVoice: voice,
        }));
        setVoices(mapped);
        if (!hasInitializedVoices.current && mapped.length > 0) {
          hasInitializedVoices.current = true;
          setSelectedVoice(mapped[0]);
        }
      } catch (e) {
        console.warn('Failed to load native voices', e);
      }
    }

    function loadWebVoices() {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const synth = window.speechSynthesis;

      const mapVoices = () => {
        const v = synth.getVoices();
        const mapped: Voice[] = v.map((voice) => ({
          id: voice.voiceURI,
          name: voice.name,
          lang: voice.lang,
          engine: 'web',
          nativeVoice: voice,
        }));
        setVoices(mapped);
        if (!hasInitializedVoices.current && mapped.length > 0) {
          hasInitializedVoices.current = true;
          setSelectedVoice(mapped[0]);
        }
      };

      mapVoices();
      synth.onvoiceschanged = mapVoices;
    }

    if (Platform.OS === 'web') {
      loadWebVoices();
    } else {
      loadNativeVoices();
    }
  }, []);

  useEffect(
    () => () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      } else {
        Speech.stop();
      }
      if (androidTimerRef.current) {
        clearInterval(androidTimerRef.current);
      }
    },
    []
  );

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      webUtteranceRef.current = null;
    } else {
      Speech.stop();
      if (androidTimerRef.current) {
        clearInterval(androidTimerRef.current);
        androidTimerRef.current = null;
      }
    }
    setIsPlaying(false);
  }, []);

  const playSentenceWeb = useCallback(
    (sentenceIndex: number, startWord: number = 0) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const synth = window.speechSynthesis;
      const sentences = sentencesRef.current;
      if (!sentences[sentenceIndex]) return;

      synth.cancel();

      const utterance: WebUtterance = new SpeechSynthesisUtterance(sentences[sentenceIndex]);
      utterance._sentenceIndex = sentenceIndex;
      utterance.rate = speed;
      utterance.pitch = pitchRef.current;

      if (selectedVoice?.nativeVoice) {
        utterance.voice = selectedVoice.nativeVoice as SpeechSynthesisVoice;
      }

      const words = sentences[sentenceIndex].split(/\s+/).filter(Boolean);

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word' || event.charIndex != null) {
          const charIndex = event.charIndex ?? 0;
          let cumulative = 0;
          let wordIndex = 0;
          for (let i = 0; i < words.length; i++) {
            const w = words[i];
            if (charIndex < cumulative + w.length + 1) {
              wordIndex = i;
              break;
            }
            cumulative += w.length + 1;
          }
          setCurrentSentenceIndex(sentenceIndex);
          setCurrentWordIndex(wordIndex);
        }
      };

      utterance.onend = () => {
        const nextSentence = sentenceIndex + 1;
        if (nextSentence < sentences.length) {
          playSentenceWeb(nextSentence, 0);
        } else {
          setIsPlaying(false);
        }
      };

      synth.speak(utterance);
      webUtteranceRef.current = utterance;
      setIsPlaying(true);
      setCurrentSentenceIndex(sentenceIndex);
      setCurrentWordIndex(startWord);
    },
    [selectedVoice, speed]
  );

  const playSentenceNative = useCallback(
    (sentenceIndex: number, startWord: number = 0) => {
      const sentences = sentencesRef.current;
      const sentence = sentences[sentenceIndex];
      if (!sentence) return;

      Speech.stop();
      if (androidTimerRef.current) {
        clearInterval(androidTimerRef.current);
      }

      const words = sentence.split(/\s+/).filter(Boolean);

      const options: Speech.SpeechOptions = {
        rate: speed,
        pitch: pitchRef.current,
        voice: selectedVoice?.nativeVoice,
        onDone: () => {
          const nextSentence = sentenceIndex + 1;
          if (androidTimerRef.current) {
            clearInterval(androidTimerRef.current);
            androidTimerRef.current = null;
          }
          if (nextSentence < sentences.length) {
            playSentenceNative(nextSentence, 0);
          } else {
            setIsPlaying(false);
          }
        },
      } as Speech.SpeechOptions;

      if (Platform.OS === 'ios') {
        (options as any).onBoundary = (event: any) => {
          if (event.charIndex != null) {
            const charIndex = event.charIndex;
            let cumulative = 0;
            let wordIndex = 0;
            for (let i = 0; i < words.length; i++) {
              const w = words[i];
              if (charIndex < cumulative + w.length + 1) {
                wordIndex = i;
                break;
              }
              cumulative += w.length + 1;
            }
            setCurrentSentenceIndex(sentenceIndex);
            setCurrentWordIndex(wordIndex);
          }
        };
      } else if (Platform.OS === 'android') {
        const estimatedDurationMs = Math.max(sentence.length * (400 / speed), 1000);
        const intervalMs = estimatedDurationMs / Math.max(words.length, 1);
        let wordIndex = startWord;

        androidTimerRef.current = setInterval(() => {
          wordIndex += 1;
          if (wordIndex >= words.length) {
            if (androidTimerRef.current) {
              clearInterval(androidTimerRef.current);
              androidTimerRef.current = null;
            }
          } else {
            setCurrentSentenceIndex(sentenceIndex);
            setCurrentWordIndex(wordIndex);
          }
        }, intervalMs);
      }

      Speech.speak(sentence, options);
      setCurrentSentenceIndex(sentenceIndex);
      setCurrentWordIndex(startWord);
      setIsPlaying(true);
    },
    [selectedVoice, speed]
  );

  const play = useCallback(
    (sentences: string[], startSentence: number = 0, startWord: number = 0) => {
      if (!sentences || sentences.length === 0) return;
      sentencesRef.current = sentences;

      if (Platform.OS === 'web') {
        playSentenceWeb(startSentence, startWord);
      } else {
        playSentenceNative(startSentence, startWord);
      }
    },
    [playSentenceNative, playSentenceWeb]
  );

  const pause = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      if (isPlaying) {
        synth.pause();
      } else {
        synth.resume();
      }
      setIsPlaying(!isPlaying);
    } else {
      Speech.stop();
      if (androidTimerRef.current) {
        clearInterval(androidTimerRef.current);
        androidTimerRef.current = null;
      }
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const skipForward = useCallback(() => {
    const sentences = sentencesRef.current;
    const next = currentSentenceIndex + 1;
    if (next < sentences.length) {
      if (Platform.OS === 'web') {
        playSentenceWeb(next, 0);
      } else {
        playSentenceNative(next, 0);
      }
    }
  }, [currentSentenceIndex, playSentenceNative, playSentenceWeb]);

  const skipBack = useCallback(() => {
    const prev = Math.max(currentSentenceIndex - 1, 0);
    if (Platform.OS === 'web') {
      playSentenceWeb(prev, 0);
    } else {
      playSentenceNative(prev, 0);
    }
  }, [currentSentenceIndex, playSentenceNative, playSentenceWeb]);

  const setVoice = useCallback((voice: Voice) => {
    setSelectedVoice(voice);
  }, []);

  const setSpeedSafe = useCallback((rate: number) => {
    const clamped = Math.min(3, Math.max(0.5, rate));
    setSpeed(clamped);
  }, []);

  const setPitch = useCallback((p: number) => {
    const clamped = Math.min(2, Math.max(0.5, p));
    setPitchState(clamped);
    pitchRef.current = clamped;
  }, []);

  return {
    voices,
    selectedVoice,
    setVoice,
    isPlaying,
    currentWordIndex,
    currentSentenceIndex,
    play,
    pause,
    stop,
    skipForward,
    skipBack,
    speed,
    setSpeed: setSpeedSafe,
    pitch,
    setPitch,
  };
}
