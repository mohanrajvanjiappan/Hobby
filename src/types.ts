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

export interface WordSearchWord {
  word: string;
  row: number;
  col: number;
  direction: string;
}

export interface WordSearchData {
  grid: string[][];
  words: WordSearchWord[];
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
  jumbledWord?: string;
  jumbled?: string;
  combatLeft?: CombatQuestion;
  combatRight?: CombatQuestion;
  grid?: string[][];
  wordsToFind?: string[];
  wordLocations?: WordSearchLocation[];
  blurTechnique?: string;
  correctAnswer: string;
  playerIndex?: number;
  rapidFireSet?: string;
  answer?: string;
  word?: string;
  correct_answer?: string;
  brand_name?: string;
  timeLimit: number;
  imageUrl?: string;
  insightImageUrl?: string;
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
  dynamicColors?: boolean;
  isMultiplayer?: boolean;
  mode?: 'video' | 'interactive';
  teamName?: string;
  playerPhoto?: string;
  playerDetails?: string;
  participantTopic?: string;
  rules?: string;
  frameSize?: 'small' | 'medium' | 'large';
  showFrames?: boolean;
  showBadges?: boolean;
  enableClapping?: boolean;
  enableMemoryBreak?: boolean;
  themeMemoryBreak?: boolean;
  memoryBreakEmojis?: string[];
  enableInsightImages?: boolean;
  isMultipleFilesLoaded?: boolean;
  players?: PlayerDetails[];
  title: string;
  timeLimit?: number;

  theme?: QuizTheme;
  questions: QuizQuestion[];
  quotes?: Quote[];
  topic: string;
  type?: 'multiple-choice' | '5-clues' | 'detective' | 'find-in-map' | 'jumbled-letters' | 'match-the-following' | 'combat-mode' | 'word-search' | 'mega-quiz' | 'identify-image' | 'text-presentation' | 'rapid-fire';
}

export type ScreenType = 'setup' | 'presentation';
