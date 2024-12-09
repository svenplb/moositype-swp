export interface TypingState {
  currentWordIndex: number;
  currentCharIndex: number;
  startTime: number | null;
  isComplete: boolean;
  errors: number;
  correctChars: number;
  wordList: string[];
}

export interface TypingSettings {
  mode: "time" | "wordcount";
  timeLimit: number;
  wordCount: number;
  punctuation: boolean;
  language: string;
  theme: string;
}

export interface WordGeneratorOptions {
  language: string;
  punctuation: boolean;
  count: number;
}

export type ThemeType = "light" | "dark" | "custom";
