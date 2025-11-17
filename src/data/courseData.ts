import type { Course, CourseTemplate, BlockLibraryItem } from '../types/course.types';

export const coursesData: Course[] = [
  {
    id: '1',
    title: 'Whole Person Safety Basics',
    description: 'Introduction to WPS principles and practices',
    status: 'published',
    blocks: 12,
    purchases: 45,
    rating: 4.8,
    editedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Psychological Safety Foundations',
    description: 'Building trust and openness in teams',
    status: 'published',
    blocks: 8,
    purchases: 32,
    rating: 4.6,
    editedDate: '2024-01-10',
  },
  {
    id: '3',
    title: 'Bias Interrupters Micro-course',
    description: 'Recognize and interrupt unconscious bias',
    status: 'draft',
    blocks: 5,
    purchases: 0,
    rating: 0,
    editedDate: '2024-01-18',
  },
];

export const templateCategories = [
  'All',
  'Business Ethics',
  'Career Management',
  'Change Management',
  'Communication',
  'Compliance',
  'Critical Thinking',
  'Customer Service',
];

export const courseTemplates: CourseTemplate[] = [
  {
    id: '1',
    title: 'Defining Business Ethics',
    description: 'Foundational understanding of ethics in business',
    duration: '15-20 min',
    category: 'Business Ethics',
    includes: ['Introduction', 'Core Concepts', 'Case Studies', 'Quiz'],
  },
  {
    id: '2',
    title: 'Workplace Integrity',
    description: 'Maintaining ethical standards at work',
    duration: '20-25 min',
    category: 'Business Ethics',
    includes: ['Overview', 'Scenarios', 'Best Practices', 'Assessment'],
  },
  {
    id: '3',
    title: 'Resolving Ethical Dilemmas',
    description: 'Framework for ethical decision-making',
    duration: '25-30 min',
    category: 'Business Ethics',
    includes: ['Problem Identification', 'Analysis', 'Solutions', 'Practice'],
  },
];

export const blockLibrary: BlockLibraryItem[] = [
  {
    type: 'section',
    label: 'Section',
    description: 'Group related lessons',
    icon: 'LayoutGrid',
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Rich text content',
    icon: 'Type',
  },
  {
    type: 'heading',
    label: 'Heading',
    description: 'Title or heading',
    icon: 'Heading',
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Single image',
    icon: 'Image',
  },
  {
    type: 'image-text',
    label: 'Image + Text',
    description: 'Split layout',
    icon: 'Columns',
  },
  {
    type: 'video',
    label: 'Video',
    description: 'Embed video content',
    icon: 'Video',
  },
  {
    type: 'accordion',
    label: 'Accordion',
    description: 'Collapsible content',
    icon: 'ChevronDown',
  },
  {
    type: 'tabs',
    label: 'Tabs',
    description: 'Tabbed content',
    icon: 'Tabs',
  },
  {
    type: 'flip-card',
    label: 'Flip Card',
    description: 'Interactive card',
    icon: 'FlipHorizontal',
  },
  {
    type: 'quiz',
    label: 'Quiz',
    description: 'Knowledge check',
    icon: 'HelpCircle',
  },
  {
    type: 'assignment',
    label: 'Assignment',
    description: 'Graded task',
    icon: 'FileText',
  },
  {
    type: 'link',
    label: 'Link',
    description: 'External resource',
    icon: 'Link',
  },
  {
    type: 'checklist',
    label: 'Checklist',
    description: 'Task list',
    icon: 'CheckSquare',
  },
  {
    type: 'certificate',
    label: 'Certificate',
    description: 'Completion badge',
    icon: 'Award',
  },
  {
    type: 'html',
    label: 'HTML',
    description: 'Custom HTML block',
    icon: 'Code',
  },
  {
    type: 'pdf',
    label: 'PDF',
    description: 'Document viewer',
    icon: 'FileText',
  },
];
