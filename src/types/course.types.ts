export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'published' | 'draft';
  blocks: number;
  purchases: number;
  rating: number;
  editedDate: string;
  thumbnail?: string;
}

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  includes: string[];
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  content?: any;
  order: number;
}

export type BlockType =
  | 'section'
  | 'text'
  | 'heading'
  | 'image'
  | 'image-text'
  | 'video'
  | 'accordion'
  | 'tabs'
  | 'flip-card'
  | 'quiz'
  | 'assignment'
  | 'link'
  | 'checklist'
  | 'certificate'
  | 'html'
  | 'pdf';

export interface BlockLibraryItem {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
}
