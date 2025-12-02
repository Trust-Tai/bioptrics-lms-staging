// New Course Builder Types based on reference images

export interface CourseSetup {
  id?: string;
  title: string;
  topic: string;
  description: string;
  learningObjectives: LearningObjective[];
  learnerAudience: 'Beginners' | 'Intermediate' | 'Advanced' | 'All Levels';
  estimatedHours: number;
  estimatedMinutes: number;
  numberOfModules: number;
  status: 'draft' | 'published' | 'archived';
}

export interface LearningObjective {
  id: string;
  text: string;
  order: number;
}

export interface ModuleData {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  order: number;
  estimatedMinutes: number;
  goals: string;
  learningObjectives: LearningObjective[];
  topics: TopicData[];
  quizzes: QuizData[];
  status: 'draft' | 'published' | 'archived';
}

export interface TopicData {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  order: number;
  contentBlocks: ContentBlockData[];
  status: 'draft' | 'published' | 'archived';
}

export interface ContentBlockData {
  id: string;
  title: string;
  topicId: string;
  order: number;
  category: 'text-images' | 'document' | 'video' | 'audio';
  subType: ContentBlockSubType;
  content: any;
  settings: any;
  style: BlockStyle;
  animation: BlockAnimation;
  status: 'draft' | 'published' | 'archived';
}

export type ContentBlockSubType = 
  // Text & Images category
  | 'text-container' 
  | 'banner-image' 
  | 'content-grid' 
  | 'flipboxes' 
  | 'accordion'
  // Document category
  | 'pdf-viewer' 
  | 'document-embed' 
  | 'downloadable-file'
  // Video category
  | 'video-player' 
  | 'youtube-embed' 
  | 'vimeo-embed'
  // Audio category
  | 'audio-player' 
  | 'podcast-embed' 
  | 'voice-recording'
  // Special types
  | 'notice-to-learner' 
  | 'quiz-embed' 
  | 'interactive-element';

export interface BlockStyle {
  backgroundColor: string;
  textColor: string;
  padding: string;
  borderRadius: string;
  border: string;
  margin: string;
  customCSS?: string;
}

export interface BlockAnimation {
  type: 'none' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-in' | 'bounce';
  duration: number;
  delay: number;
}

export interface QuizData {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  order: number;
  questions: QuizQuestion[];
  settings: QuizSettings;
  status: 'draft' | 'published' | 'archived';
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching';
  question: string;
  options: QuizOption[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizSettings {
  timeLimit: number; // 0 = no limit, in minutes
  allowRetakes: boolean;
  maxAttempts: number;
  passingScore: number; // percentage
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  requireCompletion: boolean;
}

// Content Block Library Items
export interface ContentBlockLibraryItem {
  category: 'text-images' | 'document' | 'video' | 'audio';
  subType: ContentBlockSubType;
  label: string;
  description: string;
  icon: string;
}

// Course Builder State
export interface CourseBuilderState {
  course: CourseSetup | null;
  modules: ModuleData[];
  selectedModuleId: string | null;
  selectedTopicId: string | null;
  selectedContentBlockId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CourseBuilderApiResponse extends ApiResponse<{
  course: CourseSetup;
  modules: ModuleData[];
}> {}

// Form Types
export interface CourseSetupFormData {
  title: string;
  topic: string;
  description: string;
  learnerAudience: string;
  estimatedHours: number;
  estimatedMinutes: number;
  learningObjectives: string[];
}

export interface ModuleFormData {
  title: string;
  goals: string;
  estimatedMinutes: number;
  learningObjectives: string[];
}

export interface TopicFormData {
  title: string;
  description: string;
}

// Navigation Types
export interface CourseBuilderNavigation {
  courseId: string;
  moduleId?: string;
  topicId?: string;
  view: 'overview' | 'module' | 'topic' | 'content';
}
