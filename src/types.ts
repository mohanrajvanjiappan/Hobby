export interface MatchPair {
  left: string;
  right: string;
}

export interface CombatQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface WordSearchLocation {
  word: string;
  cells: { r: number; c: number }[];
}

export interface QuizQuestion {
  id?: string;
  category?: string;
  type?: string;
  question: string;
  options?: string[];
  clues?: string[];
  sentences?: string[];
  fakeSentenceIndex?: number;
  insight?: string;
  imageSearchQuery?: string;
  nominatimQuery?: string;
  parentRegionQuery?: string;
  pairs?: MatchPair[];
  combatLeft?: CombatQuestion;
  combatRight?: CombatQuestion;
  grid?: string[][];
  wordsToFind?: string[];
  wordLocations?: WordSearchLocation[];
  correctAnswer: string;
  timeLimit: number;
  imageUrl?: string;
  imagePreviewUrl?: string;
}

export interface QuizTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

export interface Quote {
  text: string;
  author: string;
}


export interface PlayerDetails {
  id: string;
  name: string;
  photo: string;
  details: string;
  topic: string;
  score: number;
}

export interface Quiz {
  isOfflineMode?: boolean;
  mode?: 'video' | 'interactive';
  teamName?: string;
  playerPhoto?: string;
  playerDetails?: string;
  participantTopic?: string;
  players?: PlayerDetails[];
  title: string;

  theme: QuizTheme;
  questions: QuizQuestion[];
  quotes: Quote[];
  topic: string;
  type?: 'multiple-choice' | '5-clues' | 'detective' | 'find-in-map' | 'jumbled-letters' | 'match-the-following' | 'combat-mode' | 'word-search' | 'mega-quiz' | 'identify-image' | 'text-presentation';
}

export type ScreenType = 'setup' | 'presentation';
