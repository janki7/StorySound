export interface NarratorProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  speed: number;
  pitch: number;
  /** Substrings to match against available voice names (first match wins). */
  voicePreference: string[];
  category: 'storyteller' | 'professional' | 'character' | 'relaxing';
}

export const NARRATOR_PROFILES: NarratorProfile[] = [
  // --- Storyteller voices ---
  {
    id: 'warm-storyteller',
    name: 'The Storyteller',
    description: 'Warm and inviting, like a fireside narrator',
    icon: '📖',
    speed: 0.95,
    pitch: 0.95,
    voicePreference: ['Zira', 'Samantha', 'Karen', 'Moira', 'Google UK English Female'],
    category: 'storyteller',
  },
  {
    id: 'classic-narrator',
    name: 'Classic Narrator',
    description: 'Clear and rich, like a Morgan Freeman narration',
    icon: '🎭',
    speed: 0.9,
    pitch: 0.85,
    voicePreference: ['David', 'Daniel', 'Google UK English Male', 'Mark', 'Alex'],
    category: 'storyteller',
  },
  {
    id: 'dramatic-reader',
    name: 'Dramatic Reader',
    description: 'Deep and theatrical, perfect for epics',
    icon: '🎬',
    speed: 0.85,
    pitch: 0.75,
    voicePreference: ['Mark', 'David', 'Daniel', 'Google UK English Male'],
    category: 'character',
  },

  // --- Professional voices ---
  {
    id: 'audiobook-pro',
    name: 'Audiobook Pro',
    description: 'Balanced and professional audiobook delivery',
    icon: '🎧',
    speed: 1.0,
    pitch: 1.0,
    voicePreference: ['Zira', 'Samantha', 'Google US English', 'David'],
    category: 'professional',
  },
  {
    id: 'news-anchor',
    name: 'News Anchor',
    description: 'Crisp and authoritative broadcast style',
    icon: '📺',
    speed: 1.1,
    pitch: 1.05,
    voicePreference: ['David', 'Mark', 'Google US English', 'Alex'],
    category: 'professional',
  },
  {
    id: 'podcast-host',
    name: 'Podcast Host',
    description: 'Conversational and engaging, easy to listen to',
    icon: '🎙️',
    speed: 1.05,
    pitch: 1.0,
    voicePreference: ['Samantha', 'Zira', 'Karen', 'Google US English'],
    category: 'professional',
  },

  // --- Character voices ---
  {
    id: 'wise-elder',
    name: 'The Wise Elder',
    description: 'Slow and deliberate, full of gravitas',
    icon: '🧙',
    speed: 0.8,
    pitch: 0.7,
    voicePreference: ['Mark', 'Daniel', 'David', 'Google UK English Male'],
    category: 'character',
  },
  {
    id: 'fairy-tale',
    name: 'Fairy Tale Reader',
    description: 'Light and magical, perfect for fantasy',
    icon: '🧚',
    speed: 0.9,
    pitch: 1.2,
    voicePreference: ['Zira', 'Samantha', 'Karen', 'Google UK English Female'],
    category: 'character',
  },
  {
    id: 'mystery-voice',
    name: 'Mystery Narrator',
    description: 'Low and suspenseful, builds tension',
    icon: '🕵️',
    speed: 0.85,
    pitch: 0.8,
    voicePreference: ['Mark', 'David', 'Daniel', 'Google UK English Male'],
    category: 'character',
  },

  // --- Relaxing voices ---
  {
    id: 'bedtime-reader',
    name: 'Bedtime Reader',
    description: 'Soft and soothing, perfect before sleep',
    icon: '🌙',
    speed: 0.75,
    pitch: 0.9,
    voicePreference: ['Zira', 'Samantha', 'Karen', 'Moira', 'Google UK English Female'],
    category: 'relaxing',
  },
  {
    id: 'meditation-guide',
    name: 'Meditation Guide',
    description: 'Calm and measured, deeply relaxing',
    icon: '🧘',
    speed: 0.7,
    pitch: 0.85,
    voicePreference: ['Samantha', 'Zira', 'Karen', 'Moira'],
    category: 'relaxing',
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Fast-paced for power listeners',
    icon: '⚡',
    speed: 1.5,
    pitch: 1.0,
    voicePreference: ['Google US English', 'Samantha', 'David', 'Zira'],
    category: 'professional',
  },
];

export const CATEGORY_LABELS: Record<NarratorProfile['category'], { label: string; icon: string }> = {
  storyteller: { label: 'Storytellers', icon: '📚' },
  professional: { label: 'Professional', icon: '🎯' },
  character: { label: 'Character Voices', icon: '🎭' },
  relaxing: { label: 'Relaxing', icon: '😌' },
};
