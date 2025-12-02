export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BaseQuestion {
  id: string;
  questionText: string;
  imageUrl?: string;
  points: number;
  explanation?: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single-choice';
  options: QuizOption[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: QuizOption[];
  minSelections?: number;
  maxSelections?: number;
}

export interface TextResponseQuestion extends BaseQuestion {
  type: 'text-response';
  answerType: 'short' | 'long';
  maxCharacters?: number;
  sampleAnswers?: string[];
  keywords?: string[];
  caseSensitive?: boolean;
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion | TextResponseQuestion;

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  questions: Question[];
  settings: QuizSettings;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface QuizSettings {
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  allowRetakes: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  requireCompletion: boolean;
}

export interface QuizBuilderState {
  quiz: Quiz;
  selectedQuestionId: string | null;
  activeTab: 'outline' | 'content';
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}
