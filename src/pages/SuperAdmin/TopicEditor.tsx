import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { ModuleData, TopicData } from '../../types/courseBuilder.types';

// CSS Animations for Image + Text Block and Flipboxes
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes zoomIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .animate-slide-in {
    animation: slideIn 0.6s ease-out;
  }
  
  .animate-zoom-in {
    animation: zoomIn 0.6s ease-out;
  }

  /* Flipbox 3D Animations */
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  
  .flipbox-inner {
    transition: transform 0.7s;
  }
  
  .flipbox-front {
    transform: rotateY(0deg);
  }
  
  .flipbox-back {
    transform: rotateY(180deg);
  }
`;

export const TopicEditor: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId, topicId } = useParams();
  
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [activeTab, setActiveTab] = useState<'outline' | 'content'>('content');
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; blockId: string | null }>({ show: false, blockId: null });
  const [activeTabIndex, setActiveTabIndex] = useState<{ [blockId: string]: number }>({});
  const [contentGridActiveTab, setContentGridActiveTab] = useState<'content' | 'style'>('content');
  const [imageTextActiveTab, setImageTextActiveTab] = useState<'content' | 'style'>('content');
  const [richTextActiveTab, setRichTextActiveTab] = useState<'content' | 'style'>('content');
  const [dataTableActiveTab, setDataTableActiveTab] = useState<'content' | 'style'>('content');
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({
    'Text & Images': true,
    'Interactive': true,
    'Layout': true,
    'Document': true,
    'Video': true,
    'Audio': true,
    'Advanced': true
  });

  // Helper function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Mock data - in real implementation, this would come from API/context
  useEffect(() => {
    // Mock modules data
    const mockModules: ModuleData[] = [
      {
        id: '1',
        title: 'Welcome and Overview',
        courseId: 'new-course',
        order: 1,
        estimatedMinutes: 70,
        goals: 'Introduction module goals',
        learningObjectives: [],
        topics: [
          {
            id: 'topic-1-1',
            title: 'Topic #1: Introduction',
            description: '',
            moduleId: '1',
            order: 1,
            contentBlocks: [],
            status: 'draft'
          },
          {
            id: 'topic-1-2',
            title: 'Topic #2: Introduction',
            description: '',
            moduleId: '1',
            order: 2,
            contentBlocks: [],
            status: 'draft'
          },
          {
            id: 'topic-1-3',
            title: 'Topic #3: Introduction',
            description: '',
            moduleId: '1',
            order: 3,
            contentBlocks: [],
            status: 'draft'
          }
        ],
        quizzes: [
          {
            id: 'quiz-1-1',
            title: 'Quiz #1: Evaluation',
            moduleId: '1',
            order: 1,
            questions: [],
            settings: {
              timeLimit: 30,
              passingScore: 80,
              maxAttempts: 3,
              allowRetakes: true,
              shuffleQuestions: false,
              shuffleOptions: false,
              showCorrectAnswers: true,
              showScoreImmediately: true,
              requireCompletion: false
            },
            status: 'draft'
          }
        ],
        status: 'draft'
      },
      {
        id: '2',
        title: 'Core Concepts',
        courseId: 'new-course',
        order: 2,
        estimatedMinutes: 70,
        goals: '',
        learningObjectives: [],
        topics: [
          {
            id: 'topic-2-1',
            title: 'Topic #1: Introduction',
            description: '',
            moduleId: '2',
            order: 1,
            contentBlocks: [],
            status: 'draft'
          }
        ],
        quizzes: [
          {
            id: 'quiz-2-1',
            title: 'Quiz #1: Evaluation',
            moduleId: '2',
            order: 1,
            questions: [],
            settings: {
              timeLimit: 30,
              passingScore: 80,
              maxAttempts: 3,
              allowRetakes: true,
              shuffleQuestions: false,
              shuffleOptions: false,
              showCorrectAnswers: true,
              showScoreImmediately: true,
              requireCompletion: false
            },
            status: 'draft'
          }
        ],
        status: 'draft'
      }
    ];
    
    setModules(mockModules);
    
    // Find the specific topic
    const foundTopic = mockModules
      .find(m => m.id === moduleId)
      ?.topics.find(t => t.id === topicId);
    
    setTopic(foundTopic || null);
    if (foundTopic) {
      setEditTitle(foundTopic.title);
      
      // Initialize with sample content blocks for demonstration
      if (foundTopic.id === 'topic-1-2') { // Topic #2: Introduction
        setContentBlocks([
          {
            id: 'block-pdf-1',
            type: 'pdf-preview',
            title: 'PDF PREVIEW',
            content: 'PDF Preview - Click edit to configure settings',
            settings: {}
          },
          {
            id: 'block-text-1',
            type: 'text-container',
            title: 'TEXT CONTAINER',
            content: 'Text Container - Click edit to configure settings',
            settings: {}
          }
        ]);
      }
    }
  }, [moduleId, topicId]);

  const getCurrentModule = () => {
    return modules.find(m => m.id === moduleId);
  };

  const handleBackToCourseBuilder = () => {
    navigate('/content-library/builder/new');
  };

  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && topic) {
      // Update topic title
      setTopic(prev => prev ? { ...prev, title: editTitle.trim() } : null);
      
      // Update modules state to reflect the change
      setModules(prev => prev.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            topics: module.topics.map(t => 
              t.id === topicId 
                ? { ...t, title: editTitle.trim() }
                : t
            )
          };
        }
        return module;
      }));
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditTitle(topic?.title || '');
    setIsEditingTitle(false);
  };

  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const isCurrentlyCollapsed = prev[categoryName];
      
      if (isCurrentlyCollapsed) {
        // If clicking on a collapsed category, close all others and open this one
        return {
          'Text & Images': true,
          'Interactive': true,
          'Layout': true,
          'Document': true,
          'Video': true,
          'Audio': true,
          'Advanced': true,
          [categoryName]: false
        };
      } else {
        // If clicking on an expanded category, just collapse it
        return {
          ...prev,
          [categoryName]: true
        };
      }
    });
  };

  const updateBlockSettings = (blockId: string, newSettings: any) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, settings: { ...block.settings, ...newSettings } }
        : block
    ));
    
    // Update selected block if it's the one being edited
    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock((prev: any) => prev ? { ...prev, settings: { ...prev.settings, ...newSettings } } : null);
    }
  };

  const handleFileUpload = (blockId: string, file: File, fileType: 'image' | 'pdf' | 'audio' | 'video') => {
    // Create a URL for the uploaded file (in real app, this would be uploaded to server)
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    
    const settings: any = {
      fileName: fileName
    };
    
    if (fileType === 'image') {
      settings.imageUrl = fileUrl;
    } else if (fileType === 'pdf') {
      settings.pdfUrl = fileUrl;
    } else if (fileType === 'audio') {
      settings.audioUrl = fileUrl;
    } else if (fileType === 'video') {
      settings.videoUrl = fileUrl;
    }
    
    updateBlockSettings(blockId, settings);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };

  const handleAddContentBlock = (blockType: string) => {
    const blockTitles: { [key: string]: string } = {
      'text-container': 'TEXT CONTAINER',
      'pdf-preview': 'PDF PREVIEW',
      'image-block': 'IMAGE BLOCK',
      'image-gallery': 'IMAGE GALLERY',
      'video-player': 'VIDEO PLAYER',
      'youtube-embed': 'YOUTUBE EMBED',
      'audio-player': 'AUDIO PLAYER',
      'banner-image': 'BANNER IMAGE',
      'content-grid': 'CONTENT GRID',
      'flipboxes': 'FLIPBOXES',
      'accordion': 'ACCORDION',
      'tabs': 'TABS',
      'quiz': 'QUIZ',
      'multi-column': 'MULTI-COLUMN',
      'card-grid': 'CARD GRID',
      'timeline': 'TIMELINE',
      'rich-text': 'RICH TEXT EDITOR',
      'data-table': 'DATA TABLE',
      'code-block': 'CODE BLOCK',
      'embed-content': 'EMBED CONTENT',
      'file-download': 'FILE DOWNLOAD'
    };

    const blockContent: { [key: string]: string } = {
      'text-container': 'Text Container - Click edit to configure settings',
      'pdf-preview': 'PDF Preview - Click edit to configure settings',
      'image-block': 'Image Block - Click edit to upload image',
      'image-gallery': 'Image Gallery - Click edit to add images',
      'video-player': 'Video Player - Click edit to upload video',
      'youtube-embed': 'YouTube Embed - Click edit to add YouTube URL',
      'audio-player': 'Audio Player - Click edit to upload audio',
      'banner-image': 'Banner Image - Click edit to configure',
      'content-grid': 'Content Grid - Click edit to configure layout',
      'flipboxes': 'Flipboxes - Click edit to add content',
      'accordion': 'Accordion - Click edit to add sections',
      'tabs': 'Tabs - Click edit to add tab content',
      'quiz': 'Quiz - Click edit to add questions',
      'multi-column': 'Multi-Column - Click edit to configure layout',
      'card-grid': 'Card Grid - Click edit to add cards',
      'timeline': 'Timeline - Click edit to add timeline items',
      'rich-text': 'Rich Text Editor - Click edit to create formatted content',
      'data-table': 'Data Table - Click edit to add table data',
      'code-block': 'Code Block - Click edit to add code snippets',
      'embed-content': 'Embed Content - Click edit to add external content',
      'file-download': 'File Download - Click edit to upload downloadable files'
    };

    const defaultSettings: { [key: string]: any } = {
      'tabs': {
        tabs: [
          { title: 'Tab 1', content: 'This is the content for Tab 1. You can edit this text and add more tabs as needed.' },
          { title: 'Tab 2', content: 'This is the content for Tab 2. Each tab can have different content and formatting.' },
          { title: 'Tab 3', content: 'This is the content for Tab 3. Tabs are great for organizing related information.' }
        ],
        tabStyle: 'horizontal',
        defaultActiveTab: 0,
        activeTabColor: '#3b82f6',
        inactiveTabColor: '#6b7280'
      },
      'flipboxes': {
        flipboxes: [
          { 
            frontTitle: 'Feature 1', 
            frontContent: 'Hover or click to see more details about this amazing feature.',
            backTitle: 'Learn More',
            backContent: 'This feature provides excellent value and helps you achieve your goals efficiently.'
          },
          { 
            frontTitle: 'Feature 2', 
            frontContent: 'Discover the benefits of this powerful functionality.',
            backTitle: 'Benefits',
            backContent: 'Save time and increase productivity with this innovative solution.'
          },
          { 
            frontTitle: 'Feature 3', 
            frontContent: 'Explore what makes this feature special and unique.',
            backTitle: 'Details',
            backContent: 'Advanced capabilities that set us apart from the competition.'
          }
        ],
        layout: '3-columns',
        flipTrigger: 'hover',
        frontColor: '#3b82f6',
        backColor: '#10b981'
      },
      'multi-column': {
        columns: [
          { 
            content: 'This is the first column. You can add any content here including text, lists, or other information. This column will adapt to your chosen layout proportions.'
          },
          { 
            content: 'This is the second column. Multi-column layouts are perfect for organizing related information side by side. You can customize the width ratios and spacing.'
          }
        ],
        layout: '2-columns-50-50',
        gap: 'medium',
        equalHeight: true,
        backgroundColor: 'transparent'
      },
      'card-grid': {
        cards: [
          {
            title: 'Feature Card 1',
            content: 'This is a sample card showcasing your first feature or service. You can customize the content, colors, and layout to match your needs.',
            buttonText: 'Learn More',
            buttonLink: '#',
            buttonTarget: '_self'
          },
          {
            title: 'Feature Card 2', 
            content: 'This is another card that highlights a different aspect of your offering. Cards are perfect for organizing information in a visually appealing way.',
            buttonText: 'Get Started',
            buttonLink: '#',
            buttonTarget: '_blank'
          },
          {
            title: 'Feature Card 3',
            content: 'The third card completes this sample grid. You can add more cards, change the layout, and customize the styling to create the perfect presentation.',
            buttonText: 'Explore',
            buttonLink: '#',
            buttonTarget: '_self'
          }
        ],
        layout: '3-cards',
        cardStyle: 'default',
        backgroundColor: '#ffffff',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonHoverColor: '#2563eb',
        textColor: '#374151',
        titleColor: '#111827',
        enableCardLinks: true,
        cardHoverEffect: true
      },
      'image-text-block': {
        layout: 'image-left',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
        altText: 'Sample image',
        content: '<p>This is a sample image-text block. You can customize the layout, add headings, style the content, and include call-to-action buttons. Edit this block to add your own content and images.</p>',
        backgroundColor: 'transparent',
        textColor: '#000000',
        headingText: 'Sample Heading',
        headingLevel: 'h2',
        headingColor: '#000000',
        headingPosition: 'above',
        padding: '16px',
        animation: 'none',
        contentAlign: 'left',
        verticalAlign: 'center',
        buttonText: 'Learn More',
        buttonLink: '#',
        buttonTarget: '_self',
        buttonAlign: 'left',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonHoverColor: '#2563eb'
      },
      'youtube-embed': {
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoId: 'dQw4w9WgXcQ',
        title: 'Sample YouTube Video',
        startTime: 0,
        showControls: true,
        autoplay: false,
        muted: false,
        loop: false,
        size: 'medium'
      },
      'content-grid': {
        items: [
          {
            title: 'Feature Card 1',
            content: 'This is a sample content grid item showcasing your first feature. You can add images, customize layouts, and include call-to-action buttons.',
            imageLayout: 'top',
            imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
            fileName: 'sample-image-1.jpg',
            buttonText: 'Learn More',
            buttonLink: '#',
            buttonAlign: 'left',
            buttonTarget: '_self'
          },
          {
            title: 'Feature Card 2',
            content: 'Another grid item with background image layout. Perfect for creating engaging content sections with visual appeal.',
            imageLayout: 'background',
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
            fileName: 'sample-image-2.jpg',
            buttonText: 'Get Started',
            buttonLink: '#',
            buttonAlign: 'center',
            buttonTarget: '_blank'
          },
          {
            title: 'Feature Card 3',
            content: 'This card uses the side layout with title, image, then content. Great for showcasing different content types.',
            imageLayout: 'side',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            fileName: 'sample-image-3.jpg',
            buttonText: 'Explore',
            buttonLink: '#',
            buttonAlign: 'right',
            buttonTarget: '_self'
          }
        ],
        columns: '3',
        gap: 'medium',
        cardStyle: 'default',
        equalItemHeight: false,
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonHoverColor: '#2563eb'
      },
      'rich-text': {
        content: '<h2>Welcome to Rich Text Editor</h2><p>This is a powerful rich text editor with comprehensive formatting options. You can:</p><ul><li><strong>Format text</strong> with bold, italic, underline</li><li>Create <em>headings</em> and <u>styled content</u></li><li>Add lists, links, and images</li><li>Customize colors, fonts, and spacing</li></ul><p>Start editing to create amazing content!</p>',
        fontSize: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: '1.6',
        textAlign: 'left',
        textColor: '#374151',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px',
        maxWidth: '100%',
        enableSpellCheck: true,
        enableAutoSave: true,
        showWordCount: true,
        allowImageUpload: true,
        allowLinkInsertion: true,
        customCSS: ''
      },
      'data-table': {
        headers: ['Product', 'Category', 'Price', 'Stock', 'Status'],
        rows: [
          ['MacBook Pro 16"', 'Laptops', '$2,399', '15', 'In Stock'],
          ['iPhone 15 Pro', 'Smartphones', '$999', '32', 'In Stock'],
          ['iPad Air', 'Tablets', '$599', '8', 'Low Stock'],
          ['AirPods Pro', 'Audio', '$249', '25', 'In Stock'],
          ['Apple Watch', 'Wearables', '$399', '12', 'In Stock']
        ],
        rowCount: 5,
        colCount: 5,
        tableStyle: 'bordered',
        headerStyle: 'dark',
        alternateRows: true,
        enableSorting: true,
        enableSearch: true,
        enablePagination: false,
        rowsPerPage: 10,
        tableWidth: '100%',
        cellPadding: 'medium',
        fontSize: '14px',
        headerBackgroundColor: '#374151',
        headerTextColor: '#ffffff',
        rowBackgroundColor: '#ffffff',
        alternateRowColor: '#f9fafb',
        borderColor: '#e5e7eb',
        textColor: '#374151',
        hoverColor: '#f3f4f6',
        borderWidth: '1px',
        borderRadius: '8px',
        showBorders: true,
        compactMode: false,
        responsiveBreakpoint: 'md'
      },
      'file-download': {
        files: [
          {
            id: 'file-1',
            name: 'Sample Document.pdf',
            displayName: 'Sample Document',
            description: 'This is a sample downloadable file. Replace with your own content.',
            size: '2.5 MB',
            type: 'pdf',
            url: '#',
            uploadDate: new Date().toISOString()
          }
        ],
        buttonStyle: 'button',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonHoverColor: '#2563eb',
        trackDownloads: true,
        requireLogin: false,
        showFileSize: true,
        showFileType: true,
        showDescription: true,
        allowMultipleDownloads: true,
        downloadLimit: 0,
        customCSS: ''
      },
      'timeline': {
        orientation: 'vertical',
        style: 'modern',
        showConnectors: true,
        events: [
          {
            id: 'event-1',
            title: 'Project Kickoff',
            date: '2024-01-15',
            description: 'Initial project planning and team alignment meeting to establish goals and timelines.'
          },
          {
            id: 'event-2',
            title: 'Design Phase',
            date: '2024-02-01',
            description: 'Complete UI/UX design mockups and user experience flow documentation.'
          },
          {
            id: 'event-3',
            title: 'Development Sprint',
            date: '2024-02-15',
            description: 'Begin core development work with focus on key features and functionality.'
          },
          {
            id: 'event-4',
            title: 'Testing & QA',
            date: '2024-03-01',
            description: 'Comprehensive testing phase including unit tests, integration tests, and user acceptance testing.'
          },
          {
            id: 'event-5',
            title: 'Launch',
            date: '2024-03-15',
            description: 'Official product launch with full deployment and monitoring systems in place.'
          }
        ],
        primaryColor: '#3b82f6',
        secondaryColor: '#e5e7eb',
        textColor: '#374151',
        dateColor: '#6b7280',
        backgroundColor: 'transparent'
      }
    };

    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      title: blockTitles[blockType] || blockType.toUpperCase(),
      content: blockContent[blockType] || 'Click edit to configure settings',
      settings: defaultSettings[blockType] || {}
    };
    
    setContentBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
  };

  const handleDragStart = (e: React.DragEvent, block: any, index: number) => {
    setDraggedItem({ block, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.index !== dropIndex) {
      const newBlocks = [...contentBlocks];
      const [draggedBlock] = newBlocks.splice(draggedItem.index, 1);
      newBlocks.splice(dropIndex, 0, draggedBlock);
      
      setContentBlocks(newBlocks);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    setContentBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const contentBlockLibrary = [
    {
      category: 'Text & Images',
      blocks: [
        { id: 'text-container', name: 'Text Container' },
        { id: 'image-block', name: 'Image Block' },
        { id: 'image-text-block', name: 'Image + Text Block' },
        { id: 'image-gallery', name: 'Image Gallery' },
        { id: 'banner-image', name: 'Banner Image' },
        { id: 'content-grid', name: 'Content Grid' }
      ]
    },
    {
      category: 'Interactive',
      blocks: [
        { id: 'accordion', name: 'Accordion' },
        { id: 'flipboxes', name: 'Flipboxes' },
        { id: 'tabs', name: 'Tabs' }
      ]
    },
    {
      category: 'Layout',
      blocks: [
        { id: 'multi-column', name: 'Multi-Column' },
        { id: 'card-grid', name: 'Card Grid' },
        { id: 'timeline', name: 'Timeline' }
      ]
    },
    {
      category: 'Document',
      blocks: [
        { id: 'pdf-preview', name: 'PDF Preview' },
        { id: 'file-download', name: 'File Download' }
      ]
    },
    {
      category: 'Video',
      blocks: [
        { id: 'video-player', name: 'Video Player' },
        { id: 'youtube-embed', name: 'YouTube Embed' }
      ]
    },
    {
      category: 'Audio',
      blocks: [
        { id: 'audio-player', name: 'Audio Player' }
      ]
    },
    {
      category: 'Advanced',
      blocks: [
        { id: 'rich-text', name: 'Rich Text Editor' },
        { id: 'data-table', name: 'Data Table' },
        { id: 'code-block', name: 'Code Block' },
        { id: 'embed-content', name: 'Embed Content' }
      ]
    }
  ];

  if (!topic) {
    return <div>Loading...</div>;
  }

  const currentModule = getCurrentModule();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inject CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button 
                onClick={handleBackToCourseBuilder}
                className="hover:text-gray-900"
              >
                Course Overview
              </button>
              <span>→</span>
              <button 
                onClick={handleBackToCourseBuilder}
                className="hover:text-gray-900"
              >
                Module #{currentModule?.order}: {currentModule?.title}
              </button>
              <span>→</span>
              <span className="text-gray-900 font-medium">{topic?.title}</span>
            </nav>
          </div>
          
          <Button variant="primary" className="bg-orange-500 hover:bg-orange-600">
            Publish
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Editable Title */}
            <div className="flex items-center gap-3 mb-8">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-primary-500 focus:outline-none flex-1"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditTitle}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 flex-1">{topic.title}</h1>
                  <button
                    onClick={handleStartEditTitle}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Edit title"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {/* Content Blocks */}
            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div 
                  key={block.id} 
                  className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
                    dragOverIndex === index ? 'border-primary-500 shadow-lg transform scale-105' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className={`flex items-center justify-between p-4 rounded-t-lg text-white ${
                    block.type === 'pdf-preview' ? 'bg-purple-600' :
                    block.type === 'image-block' || block.type === 'image-gallery' || block.type === 'banner-image' || block.type === 'image-text-block' ? 'bg-green-600' :
                    block.type === 'video-player' || block.type === 'youtube-embed' ? 'bg-red-600' :
                    block.type === 'audio-player' ? 'bg-orange-600' :
                    block.type === 'accordion' || block.type === 'flipboxes' || block.type === 'tabs' || block.type === 'quiz' ? 'bg-indigo-600' :
                    block.type === 'multi-column' || block.type === 'card-grid' || block.type === 'timeline' || block.type === 'content-grid' ? 'bg-teal-600' :
                    block.type === 'rich-text' || block.type === 'data-table' || block.type === 'code-block' || block.type === 'embed-content' || block.type === 'file-download' ? 'bg-gray-600' :
                    'bg-blue-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      {/* Drag Handle */}
                      <div className="cursor-move p-1 hover:bg-white hover:bg-opacity-20 rounded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="12" r="1"/>
                          <circle cx="9" cy="5" r="1"/>
                          <circle cx="9" cy="19" r="1"/>
                          <circle cx="15" cy="12" r="1"/>
                          <circle cx="15" cy="5" r="1"/>
                          <circle cx="15" cy="19" r="1"/>
                        </svg>
                      </div>
                      <span className="font-medium">{block.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedBlock(block)}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                        title="Edit block"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmation({ show: true, blockId: block.id })}
                        className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                        title="Delete block"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {/* Block Preview Content */}
                    {block.type === 'image-block' && (
                      <div className="space-y-3">
                        {block.settings?.imageUrl ? (
                          <div className="relative">
                            <img 
                              src={block.settings.imageUrl} 
                              alt={block.settings.altText || 'Block image'} 
                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                            />
                            {block.settings.caption && (
                              <p className="text-sm text-gray-600 mt-2 italic">{block.settings.caption}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-500 text-sm">Click edit to upload image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'image-text-block' && (
                      <div 
                        className={`rounded-lg overflow-hidden transition-all duration-500 ${
                          block.settings?.animation === 'fade' ? 'animate-fade-in' :
                          block.settings?.animation === 'slide' ? 'animate-slide-in' :
                          block.settings?.animation === 'zoom' ? 'animate-zoom-in' : ''
                        }`}
                        style={{ 
                          backgroundColor: block.settings?.backgroundColor || 'transparent',
                          padding: block.settings?.padding || '16px'
                        }}
                      >
                        {/* Layout: Image Left, Text Right */}
                        {block.settings?.layout === 'image-left' && (
                          <div className={`flex flex-col md:flex-row gap-6 ${
                            block.settings?.verticalAlign === 'top' ? 'items-start' :
                            block.settings?.verticalAlign === 'bottom' ? 'items-end' :
                            'items-center'
                          }`}>
                            <div className="w-full md:w-1/2">
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                            <div className="w-full md:w-1/2">
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Button */}
                                {block.settings?.buttonText && block.settings?.buttonLink && (
                                  <div className={`mt-4 ${
                                    block.settings?.buttonAlign === 'center' ? 'text-center' :
                                    block.settings?.buttonAlign === 'right' ? 'text-right' :
                                    'text-left'
                                  }`}>
                                    <a
                                      href={block.settings.buttonLink}
                                      target={block.settings?.buttonTarget || '_self'}
                                      className="inline-block px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                                      style={{
                                        backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                        color: block.settings?.buttonTextColor || '#ffffff'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = block.settings?.buttonHoverColor || '#2563eb';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = block.settings?.buttonColor || '#3b82f6';
                                      }}
                                    >
                                      {block.settings.buttonText}
                                      {block.settings?.buttonTarget === '_blank' && (
                                        <svg className="inline w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      )}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Layout: Text Left, Image Right */}
                        {block.settings?.layout === 'text-left' && (
                          <div className={`flex flex-col md:flex-row gap-6 ${
                            block.settings?.verticalAlign === 'top' ? 'items-start' :
                            block.settings?.verticalAlign === 'bottom' ? 'items-end' :
                            'items-center'
                          }`}>
                            <div className="w-full md:w-1/2">
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full md:w-1/2">
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Layout: Image Top, Text Bottom */}
                        {block.settings?.layout === 'image-top' && (
                          <div className="space-y-6">
                            <div>
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Layout: Text Top, Image Bottom */}
                        {block.settings?.layout === 'text-top' && (
                          <div className="space-y-6">
                            <div>
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Default layout if none specified - use image-left as default */}
                        {(!block.settings?.layout || block.settings?.layout === 'default') && (
                          <div className={`flex flex-col md:flex-row gap-6 ${
                            block.settings?.verticalAlign === 'top' ? 'items-start' :
                            block.settings?.verticalAlign === 'bottom' ? 'items-end' :
                            'items-center'
                          }`}>
                            <div className="w-full md:w-1/2">
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                            <div className="w-full md:w-1/2">
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Default Layout (fallback when no layout is set) */}
                        {!block.settings?.layout && (
                          <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-1/2">
                              {block.settings?.imageUrl ? (
                                <img 
                                  src={block.settings.imageUrl} 
                                  alt={block.settings.altText || 'Image'} 
                                  className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Upload Image</span>
                                </div>
                              )}
                            </div>
                            <div className="w-full md:w-1/2">
                              <div className={`${
                                block.settings?.contentAlign === 'center' ? 'text-center' :
                                block.settings?.contentAlign === 'right' ? 'text-right' :
                                'text-left'
                              }`}>
                                {/* Heading Above Content */}
                                {block.settings?.headingText && block.settings?.headingPosition !== 'below' && (
                                  <div className="mb-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}

                                {/* Content */}
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ 
                                    color: block.settings?.textColor || '#000000'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: block.settings?.content || '<p class="text-gray-500">Add your content here...</p>' 
                                  }}
                                />

                                {/* Heading Below Content */}
                                {block.settings?.headingText && block.settings?.headingPosition === 'below' && (
                                  <div className="mt-4">
                                    {block.settings.headingLevel === 'h1' && (
                                      <h1 
                                        className="text-3xl font-bold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h1>
                                    )}
                                    {block.settings.headingLevel === 'h2' && (
                                      <h2 
                                        className="text-2xl font-semibold"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h2>
                                    )}
                                    {block.settings.headingLevel === 'h3' && (
                                      <h3 
                                        className="text-xl font-medium"
                                        style={{ color: block.settings?.headingColor || '#000000' }}
                                      >
                                        {block.settings.headingText}
                                      </h3>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'image-gallery' && (
                      <div className="space-y-3">
                        {block.settings?.images && block.settings.images.length > 0 ? (
                          <div>
                            <div className={`grid gap-2 ${
                              block.settings.layout === 'grid-1' ? 'grid-cols-1' :
                              block.settings.layout === 'grid-2' ? 'grid-cols-2' :
                              block.settings.layout === 'grid-3' ? 'grid-cols-3' :
                              block.settings.layout === 'grid-4' ? 'grid-cols-4' :
                              'grid-cols-2'
                            }`}>
                              {block.settings.images.map((image: any, index: number) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={image.url} 
                                    alt={image.alt || `Gallery image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                  />
                                  {block.settings.showCaptions && image.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b">
                                      {image.caption}
                                    </div>
                                  )}
                                  {block.settings.enableLightbox && (
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {block.settings.images.length > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {block.settings.images.length} image{block.settings.images.length !== 1 ? 's' : ''} • 
                                {block.settings.layout === 'grid-1' ? ' 1 column' :
                                 block.settings.layout === 'grid-2' ? ' 2 columns' :
                                 block.settings.layout === 'grid-3' ? ' 3 columns' :
                                 block.settings.layout === 'grid-4' ? ' 4 columns' : ' 2 columns'}
                                {block.settings.enableLightbox ? ' • Lightbox enabled' : ''}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-500 text-sm">Click edit to add images</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'banner-image' && (
                      <div className="space-y-3">
                        {block.settings?.imageUrl ? (
                          <div className="relative">
                            <img 
                              src={block.settings.imageUrl} 
                              alt={block.settings.altText || 'Banner image'} 
                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              style={{
                                objectPosition: block.settings?.imagePosition || 'center'
                              }}
                            />
                            {block.settings?.overlay && (
                              <div 
                                className="absolute inset-0 rounded-lg"
                                style={{
                                  backgroundColor: block.settings.overlayColor || 'rgba(0,0,0,0.3)'
                                }}
                              />
                            )}
                            {(block.settings?.title || block.settings?.subtitle) && (
                              <div className={`absolute inset-0 flex ${
                                block.settings?.textVerticalAlign === 'top' ? 'items-start pt-4 md:pt-6' :
                                block.settings?.textVerticalAlign === 'bottom' ? 'items-end pb-4 md:pb-6' :
                                'items-center'
                              } ${
                                block.settings?.textHorizontalAlign === 'left' ? 'justify-start pl-4 md:pl-6' :
                                block.settings?.textHorizontalAlign === 'right' ? 'justify-end pr-4 md:pr-6' :
                                'justify-center px-4'
                              } ${
                                block.settings?.textHorizontalAlign === 'left' ? 'text-left' :
                                block.settings?.textHorizontalAlign === 'right' ? 'text-right' :
                                'text-center'
                              }`}>
                                <div className="text-white">
                                  {block.settings?.title && (
                                    <h2 
                                      className="text-2xl font-bold mb-2"
                                      style={{ color: block.settings?.textColor || '#ffffff' }}
                                    >
                                      {block.settings.title}
                                    </h2>
                                  )}
                                  {block.settings?.subtitle && (
                                    <p 
                                      className="text-lg"
                                      style={{ color: block.settings?.textColor || '#ffffff' }}
                                    >
                                      {block.settings.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-500 text-sm">Click edit to upload banner image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'pdf-preview' && (
                      <div className="space-y-3">
                        {block.settings?.pdfUrl ? (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                              <div>
                                <p className="font-medium text-gray-900">{block.settings.fileName || 'Document.pdf'}</p>
                                <p className="text-sm text-gray-600">PDF Document</p>
                              </div>
                            </div>
                            {block.settings.allowDownload && (
                              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">Download PDF</button>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to upload PDF</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'text-container' && (
                      <div className="space-y-3">
                        {(block.settings?.heading || block.settings?.content) ? (
                          <div 
                            className={`prose prose-sm max-w-none text-${block.settings?.alignment || 'left'}`}
                          >
                            {block.settings?.heading && (
                              <h2 className="text-xl font-bold text-gray-900 mb-3">
                                {block.settings.heading}
                              </h2>
                            )}
                            {block.settings?.content && (
                              <div className="text-gray-700 whitespace-pre-wrap">
                                {block.settings.content}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add text content</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'accordion' && (
                      <div className="space-y-2">
                        {block.settings?.sections && block.settings.sections.length > 0 ? (
                          block.settings.sections.map((section: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg">
                              <div className="p-3 bg-gray-50 font-medium text-sm">
                                {section.title || `Section ${index + 1}`}
                              </div>
                              <div className="p-3 text-sm text-gray-600">
                                {section.content || 'Section content...'}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add accordion sections</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'content-grid' && (
                      <div className="space-y-3">
                        {block.settings?.items && block.settings.items.length > 0 ? (
                          <div>
                            <div className={`grid ${
                              block.settings.gap === 'small' ? 'gap-2' :
                              block.settings.gap === 'large' ? 'gap-6' :
                              'gap-4'
                            } ${
                              block.settings.columns === '2' ? 'grid-cols-1 md:grid-cols-2' :
                              block.settings.columns === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                              block.settings.columns === '4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                              block.settings.columns === '6' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
                              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}>
                              {block.settings.items.map((item: any, index: number) => (
                                <div 
                                  key={index} 
                                  className={`relative overflow-hidden transition-all duration-200 ${
                                    block.settings.equalItemHeight ? 'h-80' : 'min-h-[200px]'
                                  } ${
                                    block.settings.cardStyle === 'bordered' ? 'border-2 border-gray-300' :
                                    block.settings.cardStyle === 'shadowed' ? 'border border-gray-200 shadow-md hover:shadow-lg' :
                                    block.settings.cardStyle === 'elevated' ? 'border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1' :
                                    'border border-gray-200'
                                  } rounded-lg bg-white`}
                                  style={{
                                    backgroundImage: item.imageLayout === 'background' && item.imageUrl 
                                      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${item.imageUrl})`
                                      : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                >
                                  {/* Content Container */}
                                  <div className={`h-full flex flex-col ${
                                    item.imageLayout === 'background' ? 'text-white p-6' : 'p-4'
                                  }`}>
                                    
                                    {/* Top Image Layout */}
                                    {item.imageLayout === 'top' && item.imageUrl && (
                                      <div className="mb-3 -m-4 mb-4">
                                        <img 
                                          src={item.imageUrl} 
                                          alt={item.title || 'Grid item image'}
                                          className="w-full h-32 object-cover rounded-t-lg"
                                        />
                                      </div>
                                    )}

                                    {/* Side Layout - Title */}
                                    {item.imageLayout === 'side' && item.title && (
                                      <h4 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">
                                        {item.title}
                                      </h4>
                                    )}

                                    {/* Side Layout - Image */}
                                    {item.imageLayout === 'side' && item.imageUrl && (
                                      <div className="mb-3">
                                        <img 
                                          src={item.imageUrl} 
                                          alt={item.title || 'Grid item image'}
                                          className="w-full h-24 object-cover rounded"
                                        />
                                      </div>
                                    )}

                                    {/* Title (for non-side layouts) */}
                                    {item.imageLayout !== 'side' && item.title && (
                                      <h4 className={`font-semibold text-sm mb-2 line-clamp-2 ${
                                        item.imageLayout === 'background' ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {item.title}
                                      </h4>
                                    )}

                                    {/* Content */}
                                    {item.content && (
                                      <div className="flex-1 mb-3">
                                        <p className={`text-xs leading-relaxed ${
                                          item.imageLayout === 'background' ? 'text-gray-100' : 'text-gray-600'
                                        } ${
                                          block.settings.equalItemHeight ? 'line-clamp-4' : 'line-clamp-6'
                                        }`}>
                                          {item.content}
                                        </p>
                                      </div>
                                    )}

                                    {/* Button */}
                                    {item.buttonText && item.buttonLink && (
                                      <div className={`mt-auto ${
                                        item.buttonAlign === 'center' ? 'text-center' :
                                        item.buttonAlign === 'right' ? 'text-right' :
                                        'text-left'
                                      }`}>
                                        <a
                                          href={item.buttonLink}
                                          target={item.buttonTarget || '_self'}
                                          className="inline-block px-4 py-2 text-xs font-medium rounded transition-colors duration-200"
                                          style={{
                                            backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                            color: block.settings?.buttonTextColor || '#ffffff'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = block.settings?.buttonHoverColor || '#2563eb';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = block.settings?.buttonColor || '#3b82f6';
                                          }}
                                        >
                                          {item.buttonText}
                                          {item.buttonTarget === '_blank' && (
                                            <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                          )}
                                        </a>
                                      </div>
                                    )}

                                    {/* Empty State */}
                                    {!item.title && !item.content && !item.imageUrl && (
                                      <div className="flex-1 flex items-center justify-center text-center text-gray-400">
                                        <div>
                                          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <p className="text-xs">Grid Item {index + 1}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 text-xs text-gray-500 text-center">
                              <span>{block.settings.items.length} item{block.settings.items.length !== 1 ? 's' : ''}</span>
                              <span> • {block.settings.columns || '3'} column{block.settings.columns !== '1' ? 's' : ''}</span>
                              <span> • {
                                block.settings.gap === 'small' ? 'Small' : 
                                block.settings.gap === 'large' ? 'Large' : 'Medium'
                              } gap</span>
                              {block.settings.cardStyle && block.settings.cardStyle !== 'default' && (
                                <span> • {block.settings.cardStyle.charAt(0).toUpperCase() + block.settings.cardStyle.slice(1)} style</span>
                              )}
                              {block.settings.equalItemHeight && <span> • Equal heights</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-500 text-sm mb-2">Content Grid</p>
                            <p className="text-gray-400 text-xs">Click edit to add grid items with images and buttons</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'video-player' && (
                      <div className="space-y-3">
                        {block.settings?.videoUrl ? (
                          <div className="relative">
                            <video 
                              src={block.settings.videoUrl} 
                              controls={block.settings.showControls !== false}
                              autoPlay={block.settings.autoPlay || false}
                              loop={block.settings.loop || false}
                              muted={block.settings.muted || false}
                              className="w-full h-48 bg-black rounded-lg"
                            />
                            {block.settings.title && (
                              <div className="mt-2">
                                <h4 className="font-medium text-gray-900">{block.settings.title}</h4>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-gray-500 text-sm">Click edit to upload video</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'audio-player' && (
                      <div className="space-y-3">
                        {block.settings?.audioUrl ? (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V3H12Z" />
                              </svg>
                              <div>
                                <p className="font-medium text-gray-900">{block.settings.title || block.settings.fileName || 'Audio File'}</p>
                                <p className="text-sm text-gray-600">Audio Player</p>
                              </div>
                            </div>
                            <audio 
                              src={block.settings.audioUrl} 
                              controls 
                              className="w-full"
                              autoPlay={block.settings.autoPlay || false}
                              loop={block.settings.loop || false}
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13A4,4 0 0,0 6,17A4,4 0 0,0 10,21A4,4 0 0,0 14,17V7H18V3H12Z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to upload audio</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'quiz' && (
                      <div className="space-y-3">
                        {block.settings?.questions && block.settings.questions.length > 0 ? (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                              {block.settings.title || 'Quiz'}
                            </h4>
                            {block.settings.questions.slice(0, 2).map((question: any, index: number) => (
                              <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                                <p className="font-medium text-sm mb-2">{index + 1}. {question.question}</p>
                                <div className="space-y-1">
                                  {question.options?.slice(0, 2).map((option: string, optIndex: number) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                                      <span className="text-xs text-gray-600">{option}</span>
                                    </div>
                                  ))}
                                  {question.options?.length > 2 && (
                                    <p className="text-xs text-gray-400">+{question.options.length - 2} more options</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {block.settings.questions.length > 2 && (
                              <p className="text-xs text-gray-500">+{block.settings.questions.length - 2} more questions</p>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add quiz questions</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'tabs' && (
                      <div className="space-y-3">
                        {block.settings?.tabs && block.settings.tabs.length > 0 ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Tab Headers */}
                            <div className={`${
                              block.settings?.tabStyle === 'vertical' 
                                ? 'flex' 
                                : 'flex border-b border-gray-200 bg-gray-50'
                            }`}>
                              {block.settings?.tabStyle === 'vertical' && (
                                <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                                  {block.settings.tabs.map((tab: any, index: number) => {
                                    const currentActiveIndex = activeTabIndex[block.id] ?? (block.settings?.defaultActiveTab || 0);
                                    const isActive = index === currentActiveIndex;
                                    return (
                                      <button
                                        key={index}
                                        onClick={() => setActiveTabIndex(prev => ({ ...prev, [block.id]: index }))}
                                        className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-200 transition-colors ${
                                          isActive 
                                            ? 'text-white' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                        style={{
                                          backgroundColor: isActive ? (block.settings?.activeTabColor || '#3b82f6') : 'transparent',
                                          color: isActive ? '#ffffff' : (block.settings?.inactiveTabColor || '#6b7280')
                                        }}
                                      >
                                        {tab.title || `Tab ${index + 1}`}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              
                              {block.settings?.tabStyle !== 'vertical' && (
                                <div className="flex w-full">
                                  {block.settings.tabs.map((tab: any, index: number) => {
                                    const currentActiveIndex = activeTabIndex[block.id] ?? (block.settings?.defaultActiveTab || 0);
                                    const isActive = index === currentActiveIndex;
                                    return (
                                      <button
                                        key={index}
                                        onClick={() => setActiveTabIndex(prev => ({ ...prev, [block.id]: index }))}
                                        className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                                          isActive 
                                            ? 'border-current' 
                                            : 'border-transparent hover:bg-gray-100'
                                        }`}
                                        style={{
                                          color: isActive ? (block.settings?.activeTabColor || '#3b82f6') : (block.settings?.inactiveTabColor || '#6b7280')
                                        }}
                                      >
                                        {tab.title || `Tab ${index + 1}`}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              
                              {/* Tab Content for Vertical Layout */}
                              {block.settings?.tabStyle === 'vertical' && (
                                <div className="flex-1 p-4">
                                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {block.settings.tabs[activeTabIndex[block.id] ?? (block.settings?.defaultActiveTab || 0)]?.content || 'Tab content will appear here...'}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Tab Content for Horizontal Layout */}
                            {block.settings?.tabStyle !== 'vertical' && (
                              <div className="p-4">
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {block.settings.tabs[activeTabIndex[block.id] ?? (block.settings?.defaultActiveTab || 0)]?.content || 'Tab content will appear here...'}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add tabs</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'flipboxes' && (
                      <div className="space-y-3">
                        {block.settings?.flipboxes && block.settings.flipboxes.length > 0 ? (
                          <div className={`grid gap-4 ${
                            block.settings?.layout === '2-columns' ? 'grid-cols-1 md:grid-cols-2' :
                            block.settings?.layout === '4-columns' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                          }`}>
                            {block.settings.flipboxes.map((flipbox: any, index: number) => (
                              <div key={index} className="relative h-48 perspective-1000">
                                <div 
                                  className={`flipbox-inner w-full h-full relative transition-transform duration-700 transform-style-preserve-3d ${
                                    block.settings?.flipTrigger === 'hover' ? 'hover:rotate-y-180' : ''
                                  }`}
                                  onClick={block.settings?.flipTrigger === 'click' ? (e) => {
                                    const element = e.currentTarget;
                                    element.classList.toggle('rotate-y-180');
                                  } : undefined}
                                >
                                  {/* Front Side */}
                                  <div 
                                    className="flipbox-front absolute inset-0 w-full h-full backface-hidden rounded-lg p-4 flex flex-col justify-center items-center text-center text-white shadow-lg"
                                    style={{ backgroundColor: block.settings?.frontColor || '#3b82f6' }}
                                  >
                                    <h3 className="text-lg font-bold mb-2">
                                      {flipbox.frontTitle || `Flipbox ${index + 1}`}
                                    </h3>
                                    <p className="text-sm opacity-90">
                                      {flipbox.frontContent || 'Front side content goes here...'}
                                    </p>
                                  </div>
                                  
                                  {/* Back Side */}
                                  <div 
                                    className="flipbox-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg p-4 flex flex-col justify-center items-center text-center text-white shadow-lg"
                                    style={{ backgroundColor: block.settings?.backColor || '#10b981' }}
                                  >
                                    <h3 className="text-lg font-bold mb-2">
                                      {flipbox.backTitle || `Back ${index + 1}`}
                                    </h3>
                                    <p className="text-sm opacity-90">
                                      {flipbox.backContent || 'Back side content goes here...'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add flipboxes</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'multi-column' && (
                      <div className="space-y-3">
                        {block.settings?.columns && block.settings.columns.length > 0 ? (
                          <div 
                            className={`grid ${
                              block.settings?.gap === 'small' ? 'gap-2' :
                              block.settings?.gap === 'large' ? 'gap-6' :
                              'gap-4'
                            } ${
                              block.settings?.layout === '2-columns-50-50' ? 'grid-cols-1 md:grid-cols-2' :
                              block.settings?.layout === '2-columns-60-40' ? 'grid-cols-1 md:grid-cols-[3fr_2fr]' :
                              block.settings?.layout === '2-columns-70-30' ? 'grid-cols-1 md:grid-cols-[7fr_3fr]' :
                              block.settings?.layout === '3-columns-33-33-33' ? 'grid-cols-1 md:grid-cols-3' :
                              block.settings?.layout === '3-columns-50-25-25' ? 'grid-cols-1 md:grid-cols-[2fr_1fr_1fr]' :
                              block.settings?.layout === '4-columns-25-25-25-25' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                              'grid-cols-1 md:grid-cols-2'
                            } ${
                              block.settings?.equalHeight !== false ? 'items-stretch' : 'items-start'
                            }`}
                            style={{
                              backgroundColor: block.settings?.backgroundColor && block.settings.backgroundColor !== 'transparent' 
                                ? block.settings.backgroundColor 
                                : undefined
                            }}
                          >
                            {block.settings.columns.map((column: any, index: number) => (
                              <div 
                                key={index} 
                                className={`p-4 border border-gray-200 rounded-lg bg-white shadow-sm ${
                                  block.settings?.equalHeight !== false ? 'h-full' : ''
                                }`}
                              >
                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {column.content || `This is content for column ${index + 1}. You can edit this text and add any content you need.`}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to configure columns</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'card-grid' && (
                      <div className="space-y-3">
                        {block.settings?.cards && block.settings.cards.length > 0 ? (
                          <div className={`grid gap-4 ${
                            block.settings?.layout === '2-cards' ? 'grid-cols-1 md:grid-cols-2' :
                            block.settings?.layout === '4-cards' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                            block.settings?.layout === 'auto-fit' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                          }`}>
                            {block.settings.cards.map((card: any, index: number) => (
                              <div 
                                key={index} 
                                className={`rounded-lg p-4 transition-all duration-200 ${
                                  block.settings?.cardStyle === 'bordered' ? 'border-2 border-gray-300' :
                                  block.settings?.cardStyle === 'shadowed' ? 'shadow-md hover:shadow-lg' :
                                  block.settings?.cardStyle === 'elevated' ? 'shadow-lg hover:shadow-xl transform hover:-translate-y-1' :
                                  'border border-gray-200 shadow-sm hover:shadow-md'
                                } ${
                                  block.settings?.cardHoverEffect !== false ? 'hover:shadow-lg hover:-translate-y-0.5' : ''
                                }`}
                                style={{
                                  backgroundColor: block.settings?.backgroundColor || '#ffffff'
                                }}
                              >
                                <h4 
                                  className="font-semibold text-sm mb-2"
                                  style={{ color: block.settings?.titleColor || '#111827' }}
                                >
                                  {card.title || `Card ${index + 1}`}
                                </h4>
                                <p 
                                  className="text-sm mb-3 leading-relaxed"
                                  style={{ color: block.settings?.textColor || '#374151' }}
                                >
                                  {card.content || 'Add your card content here. This can include descriptions, features, or any information you want to highlight.'}
                                </p>
                                {card.buttonText && (
                                  <div className="flex items-center gap-2">
                                    {card.buttonLink && card.buttonLink !== '#' ? (
                                      <a
                                        href={card.buttonLink}
                                        target={card.buttonTarget || '_self'}
                                        rel={card.buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 hover:scale-105"
                                        style={{
                                          backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                          color: block.settings?.buttonTextColor || '#ffffff'
                                        }}
                                      >
                                        {card.buttonText}
                                        {card.buttonTarget === '_blank' && (
                                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        )}
                                      </a>
                                    ) : (
                                      <button 
                                        className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90"
                                        style={{
                                          backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                          color: block.settings?.buttonTextColor || '#ffffff'
                                        }}
                                      >
                                        {card.buttonText}
                                      </button>
                                    )}
                                    {card.buttonLink && card.buttonLink !== '#' && (
                                      <span className="text-xs text-gray-500">
                                        🔗 {card.buttonTarget === '_blank' ? 'Opens in new window' : 'Same window'}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add cards with links</p>
                            <p className="text-gray-400 text-xs mt-1">Customize colors, styles, and add clickable buttons</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'timeline' && (
                      <div className="space-y-3">
                        {block.settings?.events && block.settings.events.length > 0 ? (
                          <div 
                            className={`relative ${
                              block.settings?.orientation === 'horizontal' ? 'flex overflow-x-auto pb-4' : ''
                            }`}
                            style={{ backgroundColor: block.settings?.backgroundColor || 'transparent' }}
                          >
                            {/* Vertical Timeline */}
                            {block.settings?.orientation !== 'horizontal' && (
                              <>
                                {/* Connecting Line */}
                                {block.settings?.showConnectors !== false && (
                                  <div 
                                    className="absolute left-4 top-0 bottom-0 w-0.5"
                                    style={{ backgroundColor: block.settings?.secondaryColor || '#e5e7eb' }}
                                  ></div>
                                )}
                                
                                {block.settings.events.slice(0, block.settings.events.length).map((event: any, index: number) => (
                                  <div key={event.id || index} className="relative flex items-start gap-4 pb-6 last:pb-0">
                                    {/* Event Marker */}
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${
                                        block.settings?.style === 'minimal' ? 'w-3 h-3' :
                                        block.settings?.style === 'detailed' ? 'w-10 h-10' : 'w-8 h-8'
                                      }`}
                                      style={{ 
                                        backgroundColor: block.settings?.primaryColor || '#3b82f6',
                                        fontSize: block.settings?.style === 'detailed' ? '14px' : '12px'
                                      }}
                                    >
                                      {block.settings?.style === 'minimal' ? '' : index + 1}
                                    </div>
                                    
                                    {/* Event Content */}
                                    <div className="flex-1 min-w-0">
                                      <div 
                                        className={`font-medium mb-1 ${
                                          block.settings?.style === 'detailed' ? 'text-base' : 'text-sm'
                                        }`}
                                        style={{ color: block.settings?.textColor || '#374151' }}
                                      >
                                        {event.title || `Event ${index + 1}`}
                                      </div>
                                      
                                      {event.date && (
                                        <div 
                                          className={`text-xs mb-2 font-medium ${
                                            block.settings?.style === 'modern' ? 'px-2 py-1 bg-gray-100 rounded-full inline-block' : ''
                                          }`}
                                          style={{ color: block.settings?.dateColor || '#6b7280' }}
                                        >
                                          {event.date}
                                        </div>
                                      )}
                                      
                                      {event.description && (
                                        <div 
                                          className={`text-xs leading-relaxed ${
                                            block.settings?.style === 'detailed' ? 'text-sm' : 'text-xs'
                                          }`}
                                          style={{ color: block.settings?.textColor || '#374151' }}
                                        >
                                          {event.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* Horizontal Timeline */}
                            {block.settings?.orientation === 'horizontal' && (
                              <div className="flex items-center gap-6 min-w-max">
                                {block.settings.events.slice(0, block.settings.events.length).map((event: any, index: number) => (
                                  <div key={event.id || index} className="flex flex-col items-center text-center min-w-[120px]">
                                    {/* Event Marker */}
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2 ${
                                        block.settings?.style === 'minimal' ? 'w-3 h-3' :
                                        block.settings?.style === 'detailed' ? 'w-10 h-10' : 'w-8 h-8'
                                      }`}
                                      style={{ 
                                        backgroundColor: block.settings?.primaryColor || '#3b82f6',
                                        fontSize: block.settings?.style === 'detailed' ? '14px' : '12px'
                                      }}
                                    >
                                      {block.settings?.style === 'minimal' ? '' : index + 1}
                                    </div>
                                    
                                    {/* Connecting Line */}
                                    {block.settings?.showConnectors !== false && index < block.settings.events.length - 1 && (
                                      <div 
                                        className="absolute top-4 w-6 h-0.5 ml-8"
                                        style={{ 
                                          backgroundColor: block.settings?.secondaryColor || '#e5e7eb',
                                          left: `${(index + 1) * 144 - 24}px`
                                        }}
                                      ></div>
                                    )}
                                    
                                    {/* Event Content */}
                                    <div className="space-y-1">
                                      <div 
                                        className={`font-medium ${
                                          block.settings?.style === 'detailed' ? 'text-sm' : 'text-xs'
                                        }`}
                                        style={{ color: block.settings?.textColor || '#374151' }}
                                      >
                                        {event.title || `Event ${index + 1}`}
                                      </div>
                                      
                                      {event.date && (
                                        <div 
                                          className={`text-xs font-medium ${
                                            block.settings?.style === 'modern' ? 'px-2 py-1 bg-gray-100 rounded-full' : ''
                                          }`}
                                          style={{ color: block.settings?.dateColor || '#6b7280' }}
                                        >
                                          {event.date}
                                        </div>
                                      )}
                                      
                                      {event.description && block.settings?.style === 'detailed' && (
                                        <div 
                                          className="text-xs leading-relaxed max-w-[100px]"
                                          style={{ color: block.settings?.textColor || '#374151' }}
                                        >
                                          {event.description.length > 50 ? `${event.description.substring(0, 50)}...` : event.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add timeline events</p>
                            <p className="text-gray-400 text-xs mt-1">Supports vertical & horizontal layouts with custom styling</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'rich-text' && (
                      <div className="space-y-3">
                        {block.settings?.content ? (
                          <div 
                            className="border border-gray-200 rounded-lg overflow-hidden"
                            style={{
                              backgroundColor: block.settings?.backgroundColor || '#ffffff',
                              borderRadius: block.settings?.borderRadius || '8px',
                              maxWidth: block.settings?.maxWidth || '100%'
                            }}
                          >
                            <div 
                              className="prose prose-sm max-w-none rich-text-content"
                              style={{
                                padding: block.settings?.padding || '24px',
                                fontSize: block.settings?.fontSize || '16px',
                                fontFamily: block.settings?.fontFamily || 'Inter, system-ui, sans-serif',
                                lineHeight: block.settings?.lineHeight || '1.6',
                                color: block.settings?.textColor || '#374151',
                                textAlign: block.settings?.textAlign || 'left'
                              }}
                              dangerouslySetInnerHTML={{ __html: block.settings.content }} 
                            />
                            
                            {/* Word Count Display */}
                            {block.settings?.showWordCount && (
                              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                                Word count: {block.settings.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length} words
                              </div>
                            )}
                            
                            {/* Custom CSS Styles */}
                            {block.settings?.customCSS && (
                              <style dangerouslySetInnerHTML={{ __html: block.settings.customCSS }} />
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to create rich text content</p>
                            <p className="text-gray-400 text-xs mt-1">Professional WYSIWYG editor with advanced formatting</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'data-table' && (
                      <div className="space-y-3">
                        {block.settings?.rows && block.settings.rows.length > 0 ? (
                          <div 
                            className="overflow-hidden"
                            style={{
                              borderRadius: block.settings?.borderRadius || '8px',
                              border: block.settings?.showBorders !== false ? `${block.settings?.borderWidth || '1px'} solid ${block.settings?.borderColor || '#e5e7eb'}` : 'none',
                              width: block.settings?.tableWidth || '100%'
                            }}
                          >
                            {/* Search Bar */}
                            {block.settings?.enableSearch && (
                              <div className="p-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                  <input 
                                    type="text" 
                                    placeholder="Search table..." 
                                    className="text-xs border border-gray-300 rounded px-2 py-1 flex-1"
                                    disabled
                                  />
                                </div>
                              </div>
                            )}

                            <table 
                              className="w-full"
                              style={{
                                fontSize: block.settings?.fontSize || '14px',
                                color: block.settings?.textColor || '#374151'
                              }}
                            >
                              {/* Headers */}
                              {block.settings.headers && (
                                <thead>
                                  <tr
                                    style={{
                                      backgroundColor: block.settings?.headerBackgroundColor || '#374151',
                                      color: block.settings?.headerTextColor || '#ffffff'
                                    }}
                                  >
                                    {block.settings.headers.map((header: string, index: number) => (
                                      <th 
                                        key={index} 
                                        className={`text-left font-medium ${
                                          block.settings?.cellPadding === 'small' ? 'px-2 py-1' :
                                          block.settings?.cellPadding === 'large' ? 'px-4 py-3' :
                                          'px-3 py-2'
                                        } ${block.settings?.enableSorting ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                                        style={{
                                          borderRight: block.settings?.showBorders !== false ? `1px solid ${block.settings?.borderColor || '#e5e7eb'}` : 'none'
                                        }}
                                      >
                                        <div className="flex items-center gap-1">
                                          {header}
                                          {block.settings?.enableSorting && (
                                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                            </svg>
                                          )}
                                        </div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              )}

                              {/* Body */}
                              <tbody>
                                {block.settings.rows.slice(0, block.settings?.enablePagination ? (block.settings?.rowsPerPage || 10) : block.settings.rows.length).map((row: string[], rowIndex: number) => (
                                  <tr 
                                    key={rowIndex}
                                    className={`${block.settings?.compactMode ? '' : 'hover:bg-opacity-50'}`}
                                    style={{
                                      backgroundColor: block.settings?.alternateRows && rowIndex % 2 === 1 
                                        ? block.settings?.alternateRowColor || '#f9fafb'
                                        : block.settings?.rowBackgroundColor || '#ffffff',
                                      borderTop: block.settings?.showBorders !== false ? `1px solid ${block.settings?.borderColor || '#e5e7eb'}` : 'none'
                                    }}
                                  >
                                    {row.map((cell: string, cellIndex: number) => (
                                      <td 
                                        key={cellIndex} 
                                        className={`${
                                          block.settings?.cellPadding === 'small' ? 'px-2 py-1' :
                                          block.settings?.cellPadding === 'large' ? 'px-4 py-3' :
                                          'px-3 py-2'
                                        }`}
                                        style={{
                                          borderRight: block.settings?.showBorders !== false ? `1px solid ${block.settings?.borderColor || '#e5e7eb'}` : 'none'
                                        }}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Pagination */}
                            {block.settings?.enablePagination && block.settings.rows.length > (block.settings?.rowsPerPage || 10) && (
                              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  Showing 1 to {Math.min(block.settings?.rowsPerPage || 10, block.settings.rows.length)} of {block.settings.rows.length} entries
                                </span>
                                <div className="flex items-center gap-1">
                                  <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100" disabled>
                                    Previous
                                  </button>
                                  <button className="px-2 py-1 bg-primary-500 text-white rounded">1</button>
                                  <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
                                    Next
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Row Count Indicator */}
                            {!block.settings?.enablePagination && block.settings.rows.length > 5 && (
                              <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                                Showing {Math.min(5, block.settings.rows.length)} of {block.settings.rows.length} rows
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h3M3 20h18a1 1 0 001-1V5a1 1 0 00-1-1H3a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to create professional data table</p>
                            <p className="text-gray-400 text-xs mt-1">With sorting, search, pagination & custom styling</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'code-block' && (
                      <div className="space-y-3">
                        {block.settings?.code ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                              <span className="text-gray-300 text-xs">{block.settings.language || 'Code'}</span>
                              <button className="text-gray-400 hover:text-gray-200 text-xs">Copy</button>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
                              <code>{block.settings.code}</code>
                            </pre>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add code</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'youtube-embed' && (
                      <div className="space-y-3">
                        {block.settings?.videoId || block.settings?.youtubeUrl ? (
                          <div className="relative">
                            {/* Video Title */}
                            {block.settings?.title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {block.settings.title}
                              </h3>
                            )}
                            
                            {/* YouTube Embed */}
                            <div className={`relative ${
                              block.settings?.size === 'small' ? 'aspect-[16/9] max-w-md' :
                              block.settings?.size === 'large' ? 'aspect-[16/9] max-w-4xl' :
                              block.settings?.size === 'full' ? 'aspect-[16/9] w-full' :
                              'aspect-[16/9] max-w-2xl'
                            } mx-auto`}>
                              <iframe
                                src={`https://www.youtube.com/embed/${block.settings.videoId || extractYouTubeVideoId(block.settings.youtubeUrl)}?${new URLSearchParams({
                                  ...(block.settings.startTime && { start: block.settings.startTime.toString() }),
                                  ...(block.settings.autoplay && { autoplay: '1' }),
                                  ...(block.settings.muted && { mute: '1' }),
                                  ...(block.settings.loop && { loop: '1', playlist: block.settings.videoId || extractYouTubeVideoId(block.settings.youtubeUrl) || '' }),
                                  ...(block.settings.showControls === false && { controls: '0' }),
                                  rel: '0',
                                  modestbranding: '1'
                                }).toString()}`}
                                className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={block.settings?.title || 'YouTube Video'}
                              />
                            </div>
                            
                            {/* Video Info */}
                            <div className="mt-2 text-xs text-gray-500 text-center">
                              <span>YouTube Video</span>
                              {block.settings?.startTime > 0 && (
                                <span> • Starts at {Math.floor(block.settings.startTime / 60)}:{(block.settings.startTime % 60).toString().padStart(2, '0')}</span>
                              )}
                              {block.settings?.size && (
                                <span> • {block.settings.size.charAt(0).toUpperCase() + block.settings.size.slice(1)} size</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to add YouTube URL</p>
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'file-download' && (
                      <div className="space-y-3">
                        {block.settings?.files && block.settings.files.length > 0 ? (
                          <div className="space-y-3">
                            {block.settings.files.map((file: any) => (
                              <div 
                                key={file.id} 
                                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                              >
                                <div className="flex items-start gap-3">
                                  {/* File Icon */}
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* File Details */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {file.displayName || file.name}
                                    </h4>
                                    {block.settings?.showDescription && file.description && (
                                      <p className="text-xs text-gray-600 mt-1">{file.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                      {block.settings?.showFileType && file.type && (
                                        <span className="uppercase font-medium">{file.type}</span>
                                      )}
                                      {block.settings?.showFileSize && file.size && (
                                        <span>{file.size}</span>
                                      )}
                                      {file.uploadDate && (
                                        <span>Added {new Date(file.uploadDate).toLocaleDateString()}</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Download Button */}
                                  <div className="flex-shrink-0">
                                    {block.settings?.buttonStyle === 'link' ? (
                                      <a
                                        href={file.url}
                                        className="text-sm font-medium hover:underline"
                                        style={{ color: block.settings?.buttonColor || '#3b82f6' }}
                                        download
                                      >
                                        Download
                                      </a>
                                    ) : block.settings?.buttonStyle === 'card' ? (
                                      <button
                                        className="px-3 py-2 text-xs font-medium rounded-md border transition-colors"
                                        style={{
                                          backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                          color: block.settings?.buttonTextColor || '#ffffff',
                                          borderColor: block.settings?.buttonColor || '#3b82f6'
                                        }}
                                      >
                                        <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download
                                      </button>
                                    ) : (
                                      <button
                                        className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:opacity-90"
                                        style={{
                                          backgroundColor: block.settings?.buttonColor || '#3b82f6',
                                          color: block.settings?.buttonTextColor || '#ffffff'
                                        }}
                                      >
                                        Download
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Download Stats */}
                            {block.settings?.trackDownloads && (
                              <div className="text-xs text-gray-500 text-center py-2">
                                📊 Download analytics enabled
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Click edit to upload downloadable files</p>
                            <p className="text-gray-400 text-xs mt-1">Support for PDFs, documents, images, and more</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Default fallback for other block types */}
                    {!['image-block', 'image-gallery', 'pdf-preview', 'text-container', 'accordion', 'content-grid', 'video-player', 'audio-player', 'quiz', 'tabs', 'cards', 'timeline', 'rich-text', 'data-table', 'code-block', 'youtube-embed', 'file-download'].includes(block.type) && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-500 text-sm">{block.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add Content Area */}
              {contentBlocks.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
                  <div className="max-w-md mx-auto">
                    <Plus size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Add Content</h3>
                    <p className="text-gray-600 mb-6">
                      Start building your topic by adding content blocks from the sidebar.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Always show add content option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                <Plus size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Add Content</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('outline')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'outline'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Outline
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'outline' && (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Module #{module.order}: {module.title}
                    </h4>
                    
                    <div className="space-y-1 ml-4">
                      {module.topics.map((topicItem) => (
                        <div
                          key={topicItem.id}
                          className={`flex items-center gap-2 p-2 rounded text-sm ${
                            topicItem.id === topic.id
                              ? 'bg-primary-50 text-primary-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span>{topicItem.title}</span>
                        </div>
                      ))}
                      
                      {module.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex items-center gap-2 p-2 rounded text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>{quiz.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                {selectedBlock ? (
                  /* Content Block Settings */
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <button 
                        onClick={() => setSelectedBlock(null)}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        ← Back to elements
                      </button>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-4">
                      {selectedBlock.title} Settings
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedBlock.type === 'text-container' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Heading
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.heading || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { heading: e.target.value })}
                              placeholder="Enter heading"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Main Text
                            </label>
                            <textarea 
                              value={selectedBlock.settings?.content || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { content: e.target.value })}
                              placeholder="Enter main text"
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Text Alignment
                            </label>
                            <select 
                              value={selectedBlock.settings?.alignment || 'left'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { alignment: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                              <option value="justify">Justify</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      {selectedBlock.type === 'pdf-preview' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Source
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(selectedBlock.id, file, 'pdf');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14,2 14,8 20,8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10,9 9,9 8,9"/>
                                </svg>
                                {selectedBlock.settings?.pdfUrl ? 'Change PDF' : 'Upload PDF'}
                              </button>
                            </div>
                            {selectedBlock.settings?.fileName && (
                              <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
                                <strong>Selected:</strong> {selectedBlock.settings.fileName}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="allowDownload" 
                              checked={selectedBlock.settings?.allowDownload || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { allowDownload: e.target.checked })}
                            />
                            <label htmlFor="allowDownload" className="text-sm text-gray-700">
                              Allow download
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'image-block' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image Source
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(selectedBlock.id, file, 'image');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21,15 16,10 5,21"/>
                                </svg>
                                {selectedBlock.settings?.imageUrl ? 'Change Image' : 'Upload Image'}
                              </button>
                            </div>
                            {selectedBlock.settings?.imageUrl && (
                              <div className="mt-2">
                                <img 
                                  src={selectedBlock.settings.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Alt Text
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.altText || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { altText: e.target.value })}
                              placeholder="Enter alt text for accessibility"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Caption
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.caption || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { caption: e.target.value })}
                              placeholder="Enter image caption (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Size
                            </label>
                            <select 
                              value={selectedBlock.settings?.size || 'Medium'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { size: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option>Small</option>
                              <option>Medium</option>
                              <option>Large</option>
                              <option>Full Width</option>
                            </select>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'image-text-block' && (
                        <>
                          {/* Tab Navigation */}
                          <div className="flex border-b border-gray-200 mb-4">
                            <button
                              onClick={() => setImageTextActiveTab('content')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                imageTextActiveTab === 'content'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Content
                            </button>
                            <button
                              onClick={() => setImageTextActiveTab('style')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                imageTextActiveTab === 'style'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Style
                            </button>
                          </div>

                          {/* Content Tab */}
                          {imageTextActiveTab === 'content' && (
                            <>
                              {/* Layout Configuration */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Layout Style
                                </label>
                                <select 
                                  value={selectedBlock.settings?.layout || 'image-left'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { layout: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="image-left">Image Left, Text Right</option>
                                  <option value="text-left">Text Left, Image Right</option>
                                  <option value="image-top">Image Top, Text Bottom</option>
                                  <option value="text-top">Text Top, Image Bottom</option>
                                </select>
                              </div>

                              {/* Image Upload */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Image Source
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleFileUpload(selectedBlock.id, file, 'image');
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                      <circle cx="8.5" cy="8.5" r="1.5"/>
                                      <polyline points="21,15 16,10 5,21"/>
                                    </svg>
                                    {selectedBlock.settings?.imageUrl ? 'Change Image' : 'Upload Image'}
                                  </button>
                                </div>
                                {selectedBlock.settings?.imageUrl && (
                                  <div className="mt-2">
                                    <img 
                                      src={selectedBlock.settings.imageUrl} 
                                      alt="Preview" 
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Alt Text */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Alt Text
                                </label>
                                <input 
                                  type="text" 
                                  value={selectedBlock.settings?.altText || ''}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { altText: e.target.value })}
                                  placeholder="Enter alt text for accessibility"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </div>

                              {/* Heading Options */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Add Heading
                                </label>
                                <div className="space-y-3">
                                  {/* Heading Text Input */}
                                  <div>
                                    <input 
                                      type="text" 
                                      value={selectedBlock.settings?.headingText || ''}
                                      onChange={(e) => {
                                        updateBlockSettings(selectedBlock.id, { 
                                          headingText: e.target.value,
                                          headingLevel: selectedBlock.settings?.headingLevel || 'h2'
                                        });
                                      }}
                                      placeholder="Enter heading text"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>

                                  {/* Heading Level */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Heading Level</label>
                                    <select 
                                      value={selectedBlock.settings?.headingLevel || 'h2'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { headingLevel: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="h1">H1 - Main Heading</option>
                                      <option value="h2">H2 - Section Heading</option>
                                      <option value="h3">H3 - Subsection Heading</option>
                                    </select>
                                  </div>

                                  {/* Heading Position */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Heading Position</label>
                                    <select 
                                      value={selectedBlock.settings?.headingPosition || 'above'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { headingPosition: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="above">Above Content</option>
                                      <option value="below">Below Content</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* WYSIWYG Content Editor */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Content
                                </label>
                            
                            {/* Rich Text Toolbar */}
                            <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const selection = window.getSelection();
                                  if (selection && selection.rangeCount > 0) {
                                    document.execCommand('bold', false);
                                  }
                                }}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 font-bold"
                                title="Bold"
                              >
                                B
                              </button>
                              <button
                                type="button"
                                onClick={() => document.execCommand('italic', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 italic"
                                title="Italic"
                              >
                                I
                              </button>
                              <button
                                type="button"
                                onClick={() => document.execCommand('underline', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 underline"
                                title="Underline"
                              >
                                U
                              </button>
                              <div className="w-px bg-gray-300 mx-1"></div>
                              <button
                                type="button"
                                onClick={() => document.execCommand('justifyLeft', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                title="Align Left"
                              >
                                ⬅
                              </button>
                              <button
                                type="button"
                                onClick={() => document.execCommand('justifyCenter', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                title="Align Center"
                              >
                                ↔
                              </button>
                              <button
                                type="button"
                                onClick={() => document.execCommand('justifyRight', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                title="Align Right"
                              >
                                ➡
                              </button>
                              <div className="w-px bg-gray-300 mx-1"></div>
                              <button
                                type="button"
                                onClick={() => document.execCommand('insertUnorderedList', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                title="Bullet List"
                              >
                                •
                              </button>
                              <button
                                type="button"
                                onClick={() => document.execCommand('insertOrderedList', false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                title="Numbered List"
                              >
                                1.
                              </button>
                              <div className="w-px bg-gray-300 mx-1"></div>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    document.execCommand('formatBlock', false, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                className="text-xs border border-gray-300 rounded px-1 py-1"
                              >
                                <option value="">Format</option>
                                <option value="h1">Heading 1</option>
                                <option value="h2">Heading 2</option>
                                <option value="h3">Heading 3</option>
                                <option value="p">Paragraph</option>
                              </select>
                            </div>

                            {/* Content Editor */}
                            <div
                              contentEditable
                              suppressContentEditableWarning={true}
                              onInput={(e) => {
                                const content = e.currentTarget.innerHTML;
                                updateBlockSettings(selectedBlock.id, { content });
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text/plain');
                                document.execCommand('insertText', false, text);
                              }}
                              className="w-full min-h-[200px] p-3 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-500 prose prose-sm max-w-none"
                              style={{ whiteSpace: 'pre-wrap' }}
                              dangerouslySetInnerHTML={{
                                __html: selectedBlock.settings?.content || '<p>Start typing your content here...</p>'
                              }}
                                />
                              </div>

                              {/* Button Options */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Add Button
                                </label>
                                <div className="space-y-3">
                                  {/* Button Text */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                                    <input 
                                      type="text" 
                                      value={selectedBlock.settings?.buttonText || ''}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonText: e.target.value })}
                                      placeholder="Enter button text"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>

                                  {/* Button Link */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Link</label>
                                    <input 
                                      type="url" 
                                      value={selectedBlock.settings?.buttonLink || ''}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonLink: e.target.value })}
                                      placeholder="https://example.com"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>

                                  {/* Button Target */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Link Target</label>
                                    <select 
                                      value={selectedBlock.settings?.buttonTarget || '_self'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTarget: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="_self">Same Tab</option>
                                      <option value="_blank">New Tab</option>
                                    </select>
                                  </div>

                                  {/* Button Alignment */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Alignment</label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { buttonAlign: 'left' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.buttonAlign === 'left' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Left
                                      </button>
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { buttonAlign: 'center' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.buttonAlign === 'center' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Center
                                      </button>
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { buttonAlign: 'right' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.buttonAlign === 'right' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Right
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Style Tab */}
                          {imageTextActiveTab === 'style' && (
                            <>
                              {/* Background Color */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Background Color
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                    placeholder="#ffffff"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { backgroundColor: 'transparent' })}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>

                              {/* Text Color */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Text Color
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.textColor || '#000000'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.textColor || '#000000'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                    placeholder="#000000"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textColor: '#000000' })}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>

                              {/* Heading Color */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Heading Color
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.headingColor || '#000000'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { headingColor: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.headingColor || '#000000'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { headingColor: e.target.value })}
                                    placeholder="#000000"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { headingColor: '#000000' })}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>

                              {/* Button Colors */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Button Colors
                                </label>
                                <div className="space-y-3">
                                  {/* Button Background Color */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                        placeholder="#3b82f6"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Button Text Color */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Text Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                        placeholder="#ffffff"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Button Hover Color */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Hover Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonHoverColor || '#2563eb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonHoverColor: e.target.value })}
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonHoverColor || '#2563eb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonHoverColor: e.target.value })}
                                        placeholder="#2563eb"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Padding */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Padding
                                </label>
                                <select 
                                  value={selectedBlock.settings?.padding || '16px'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { padding: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="0px">None</option>
                                  <option value="8px">Small</option>
                                  <option value="16px">Medium</option>
                                  <option value="24px">Large</option>
                                  <option value="32px">Extra Large</option>
                                </select>
                              </div>

                              {/* Animation */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Animation
                                </label>
                                <select 
                                  value={selectedBlock.settings?.animation || 'none'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { animation: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="none">None</option>
                                  <option value="fade">Fade In</option>
                                  <option value="slide">Slide In</option>
                                  <option value="zoom">Zoom In</option>
                                </select>
                              </div>

                              {/* Content Alignment */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Content Alignment
                                </label>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { contentAlign: 'left' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.contentAlign === 'left' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Left
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { contentAlign: 'center' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.contentAlign === 'center' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Center
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { contentAlign: 'right' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.contentAlign === 'right' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Right
                                  </button>
                                </div>
                              </div>

                              {/* Vertical Alignment */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Vertical Alignment
                                </label>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { verticalAlign: 'top' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.verticalAlign === 'top' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Top
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { verticalAlign: 'center' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.verticalAlign === 'center' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Center
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { verticalAlign: 'bottom' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.verticalAlign === 'bottom' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Bottom
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {selectedBlock.type === 'image-gallery' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gallery Images
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0) {
                                    const newImages = files.map(file => ({
                                      url: URL.createObjectURL(file),
                                      alt: '',
                                      caption: '',
                                      fileName: file.name
                                    }));
                                    const existingImages = selectedBlock.settings?.images || [];
                                    updateBlockSettings(selectedBlock.id, { 
                                      images: [...existingImages, ...newImages] 
                                    });
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21,15 16,10 5,21"/>
                                </svg>
                                Upload Multiple Images
                              </button>
                            </div>
                            
                            {/* Display uploaded images with edit options */}
                            {selectedBlock.settings?.images && selectedBlock.settings.images.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Uploaded Images ({selectedBlock.settings.images.length})</p>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                  {selectedBlock.settings.images.map((image: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                                      <img src={image.url} alt="" className="w-12 h-12 object-cover rounded" />
                                      <div className="flex-1 min-w-0">
                                        <input
                                          type="text"
                                          value={image.alt || ''}
                                          onChange={(e) => {
                                            const images = [...selectedBlock.settings.images];
                                            images[index] = { ...images[index], alt: e.target.value };
                                            updateBlockSettings(selectedBlock.id, { images });
                                          }}
                                          placeholder="Alt text"
                                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-1"
                                        />
                                        <input
                                          type="text"
                                          value={image.caption || ''}
                                          onChange={(e) => {
                                            const images = [...selectedBlock.settings.images];
                                            images[index] = { ...images[index], caption: e.target.value };
                                            updateBlockSettings(selectedBlock.id, { images });
                                          }}
                                          placeholder="Caption"
                                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          const images = selectedBlock.settings.images.filter((_: any, i: number) => i !== index);
                                          updateBlockSettings(selectedBlock.id, { images });
                                        }}
                                        className="text-red-600 hover:text-red-800 p-1"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gallery Layout
                            </label>
                            <select 
                              value={selectedBlock.settings?.layout || 'grid-2'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { layout: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="grid-1">Grid (1 column)</option>
                              <option value="grid-2">Grid (2 columns)</option>
                              <option value="grid-3">Grid (3 columns)</option>
                              <option value="grid-4">Grid (4 columns)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="showCaptions" 
                              checked={selectedBlock.settings?.showCaptions || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { showCaptions: e.target.checked })}
                            />
                            <label htmlFor="showCaptions" className="text-sm text-gray-700">
                              Show captions
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="enableLightbox" 
                              checked={selectedBlock.settings?.enableLightbox || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { enableLightbox: e.target.checked })}
                            />
                            <label htmlFor="enableLightbox" className="text-sm text-gray-700">
                              Enable lightbox
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'banner-image' && (
                        <>
                          {/* Image Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Image
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(selectedBlock.id, file, 'image');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21,15 16,10 5,21"/>
                                </svg>
                                {selectedBlock.settings?.imageUrl ? 'Change Banner Image' : 'Upload Banner Image'}
                              </button>
                            </div>
                            {selectedBlock.settings?.imageUrl && (
                              <div className="mt-2">
                                <img 
                                  src={selectedBlock.settings.imageUrl} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                          </div>

                          {/* Alt Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Alt Text
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.altText || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { altText: e.target.value })}
                              placeholder="Enter alt text for accessibility"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          {/* Banner Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Title
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.title || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { title: e.target.value })}
                              placeholder="Enter banner title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Banner Subtitle
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.subtitle || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { subtitle: e.target.value })}
                              placeholder="Enter banner subtitle"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          {/* Text Color */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Text Color
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={selectedBlock.settings?.textColor || '#ffffff'}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={selectedBlock.settings?.textColor || '#ffffff'}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                placeholder="#ffffff"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                          </div>

                          {/* Text Position */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Text Position
                            </label>
                            <div className="space-y-3">
                              {/* Horizontal Alignment */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Horizontal Alignment</label>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textHorizontalAlign: 'left' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textHorizontalAlign === 'left' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Left
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textHorizontalAlign: 'center' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textHorizontalAlign === 'center' || !selectedBlock.settings?.textHorizontalAlign
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Center
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textHorizontalAlign: 'right' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textHorizontalAlign === 'right' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Right
                                  </button>
                                </div>
                              </div>

                              {/* Vertical Alignment */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Vertical Alignment</label>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textVerticalAlign: 'top' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textVerticalAlign === 'top' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Top
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textVerticalAlign: 'center' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textVerticalAlign === 'center' || !selectedBlock.settings?.textVerticalAlign
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Center
                                  </button>
                                  <button
                                    onClick={() => updateBlockSettings(selectedBlock.id, { textVerticalAlign: 'bottom' })}
                                    className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                      selectedBlock.settings?.textVerticalAlign === 'bottom' 
                                        ? 'bg-primary-500 text-white border-primary-500' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    Bottom
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Image Position */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image Position
                            </label>
                            <select 
                              value={selectedBlock.settings?.imagePosition || 'center'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { imagePosition: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>

                          {/* Overlay */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <input 
                                type="checkbox" 
                                id="enableOverlay" 
                                checked={selectedBlock.settings?.overlay || false}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { overlay: e.target.checked })}
                              />
                              <label htmlFor="enableOverlay" className="text-sm font-medium text-gray-700">
                                Enable Overlay
                              </label>
                            </div>
                            
                            {selectedBlock.settings?.overlay && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Overlay Color
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.overlayColor?.replace('rgba(', '').replace(')', '').split(',').slice(0, 3).map((v: string, i: number) => {
                                      const num = parseInt(v.trim());
                                      return i === 0 ? num.toString(16).padStart(2, '0') : num.toString(16).padStart(2, '0');
                                    }).join('') ? `#${selectedBlock.settings?.overlayColor?.replace('rgba(', '').replace(')', '').split(',').slice(0, 3).map((v: string) => parseInt(v.trim()).toString(16).padStart(2, '0')).join('')}` : '#000000'}
                                    onChange={(e) => {
                                      const hex = e.target.value;
                                      const r = parseInt(hex.slice(1, 3), 16);
                                      const g = parseInt(hex.slice(3, 5), 16);
                                      const b = parseInt(hex.slice(5, 7), 16);
                                      const alpha = selectedBlock.settings?.overlayColor?.includes('rgba') ? 
                                        parseFloat(selectedBlock.settings.overlayColor.split(',')[3]?.replace(')', '').trim()) || 0.3 : 0.3;
                                      updateBlockSettings(selectedBlock.id, { overlayColor: `rgba(${r},${g},${b},${alpha})` });
                                    }}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={selectedBlock.settings?.overlayColor?.includes('rgba') ? 
                                      parseFloat(selectedBlock.settings.overlayColor.split(',')[3]?.replace(')', '').trim()) || 0.3 : 0.3}
                                    onChange={(e) => {
                                      const alpha = parseFloat(e.target.value);
                                      const currentColor = selectedBlock.settings?.overlayColor || 'rgba(0,0,0,0.3)';
                                      const rgb = currentColor.replace('rgba(', '').replace(')', '').split(',').slice(0, 3).join(',');
                                      updateBlockSettings(selectedBlock.id, { overlayColor: `rgba(${rgb},${alpha})` });
                                    }}
                                    className="flex-1"
                                  />
                                  <span className="text-sm text-gray-600 min-w-[3rem]">
                                    {Math.round((selectedBlock.settings?.overlayColor?.includes('rgba') ? 
                                      parseFloat(selectedBlock.settings.overlayColor.split(',')[3]?.replace(')', '').trim()) || 0.3 : 0.3) * 100)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'video-player' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Video Source
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(selectedBlock.id, file, 'video');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polygon points="23 7 16 12 23 17 23 7"/>
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                </svg>
                                {selectedBlock.settings?.videoUrl ? 'Change Video' : 'Upload Video'}
                              </button>
                            </div>
                            {selectedBlock.settings?.fileName && (
                              <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
                                <strong>Selected:</strong> {selectedBlock.settings.fileName}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Video Title
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.title || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { title: e.target.value })}
                              placeholder="Enter video title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="autoplay" 
                              checked={selectedBlock.settings?.autoPlay || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { autoPlay: e.target.checked })}
                            />
                            <label htmlFor="autoplay" className="text-sm text-gray-700">
                              Autoplay
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="showControls" 
                              checked={selectedBlock.settings?.showControls !== false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { showControls: e.target.checked })}
                            />
                            <label htmlFor="showControls" className="text-sm text-gray-700">
                              Show controls
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="loop" 
                              checked={selectedBlock.settings?.loop || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { loop: e.target.checked })}
                            />
                            <label htmlFor="loop" className="text-sm text-gray-700">
                              Loop video
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="muted" 
                              checked={selectedBlock.settings?.muted || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { muted: e.target.checked })}
                            />
                            <label htmlFor="muted" className="text-sm text-gray-700">
                              Muted by default
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'youtube-embed' && (
                        <>
                          {/* YouTube URL */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              YouTube URL
                            </label>
                            <input 
                              type="url" 
                              value={selectedBlock.settings?.youtubeUrl || ''}
                              onChange={(e) => {
                                const url = e.target.value;
                                const videoId = extractYouTubeVideoId(url);
                                updateBlockSettings(selectedBlock.id, { 
                                  youtubeUrl: url,
                                  videoId: videoId
                                });
                              }}
                              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Paste any YouTube URL (watch, share, or embed format)
                            </p>
                          </div>

                          {/* Video Title */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Video Title
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.title || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { title: e.target.value })}
                              placeholder="Enter video title (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          {/* Start Time */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Time (seconds)
                            </label>
                            <input 
                              type="number" 
                              value={selectedBlock.settings?.startTime || 0}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { startTime: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Video will start playing from this time
                            </p>
                          </div>

                          {/* Video Options */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Video Options
                            </label>
                            
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id="showControls" 
                                checked={selectedBlock.settings?.showControls !== false}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { showControls: e.target.checked })}
                              />
                              <label htmlFor="showControls" className="text-sm text-gray-700">
                                Show YouTube controls
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id="autoplay" 
                                checked={selectedBlock.settings?.autoplay || false}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { autoplay: e.target.checked })}
                              />
                              <label htmlFor="autoplay" className="text-sm text-gray-700">
                                Autoplay video
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id="muted" 
                                checked={selectedBlock.settings?.muted || false}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { muted: e.target.checked })}
                              />
                              <label htmlFor="muted" className="text-sm text-gray-700">
                                Start muted
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id="loop" 
                                checked={selectedBlock.settings?.loop || false}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { loop: e.target.checked })}
                              />
                              <label htmlFor="loop" className="text-sm text-gray-700">
                                Loop video
                              </label>
                            </div>
                          </div>

                          {/* Video Size */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Video Size
                            </label>
                            <select 
                              value={selectedBlock.settings?.size || 'medium'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { size: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="small">Small (480x270)</option>
                              <option value="medium">Medium (640x360)</option>
                              <option value="large">Large (854x480)</option>
                              <option value="full">Full Width</option>
                            </select>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'audio-player' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Audio Source
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(selectedBlock.id, file, 'audio');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="9 18V5l12-2v13"/>
                                  <circle cx="6" cy="18" r="3"/>
                                  <circle cx="18" cy="16" r="3"/>
                                </svg>
                                {selectedBlock.settings?.audioUrl ? 'Change Audio' : 'Upload Audio'}
                              </button>
                            </div>
                            {selectedBlock.settings?.fileName && (
                              <div className="mt-2 p-2 bg-gray-50 rounded border text-sm">
                                <strong>Selected:</strong> {selectedBlock.settings.fileName}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Audio Title
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.title || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { title: e.target.value })}
                              placeholder="Enter audio title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea 
                              value={selectedBlock.settings?.description || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { description: e.target.value })}
                              placeholder="Enter audio description"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="autoPlayAudio" 
                              checked={selectedBlock.settings?.autoPlay || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { autoPlay: e.target.checked })}
                            />
                            <label htmlFor="autoPlayAudio" className="text-sm text-gray-700">
                              Autoplay
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="loopAudio" 
                              checked={selectedBlock.settings?.loop || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { loop: e.target.checked })}
                            />
                            <label htmlFor="loopAudio" className="text-sm text-gray-700">
                              Loop audio
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="showDownloadAudio" 
                              checked={selectedBlock.settings?.allowDownload || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { allowDownload: e.target.checked })}
                            />
                            <label htmlFor="showDownloadAudio" className="text-sm text-gray-700">
                              Allow download
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'accordion' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Accordion Sections
                            </label>
                            <div className="space-y-2 mb-3">
                              {(selectedBlock.settings?.sections || [{ title: '', content: '' }]).map((section: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                                    {(selectedBlock.settings?.sections?.length || 1) > 1 && (
                                      <button
                                        onClick={() => {
                                          const sections = [...(selectedBlock.settings?.sections || [])];
                                          sections.splice(index, 1);
                                          updateBlockSettings(selectedBlock.id, { sections });
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <input 
                                    type="text" 
                                    value={section.title || ''}
                                    onChange={(e) => {
                                      const sections = [...(selectedBlock.settings?.sections || [{ title: '', content: '' }])];
                                      sections[index] = { ...sections[index], title: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { sections });
                                    }}
                                    placeholder={`Section ${index + 1} Title`}
                                    className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                  <textarea 
                                    value={section.content || ''}
                                    onChange={(e) => {
                                      const sections = [...(selectedBlock.settings?.sections || [{ title: '', content: '' }])];
                                      sections[index] = { ...sections[index], content: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { sections });
                                    }}
                                    placeholder={`Section ${index + 1} Content`}
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const sections = [...(selectedBlock.settings?.sections || [])];
                                sections.push({ title: '', content: '' });
                                updateBlockSettings(selectedBlock.id, { sections });
                              }}
                              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400"
                            >
                              + Add Section
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="allowMultipleOpen" 
                              checked={selectedBlock.settings?.allowMultipleOpen || false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { allowMultipleOpen: e.target.checked })}
                            />
                            <label htmlFor="allowMultipleOpen" className="text-sm text-gray-700">
                              Allow multiple sections open
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="openFirstByDefault" 
                              checked={selectedBlock.settings?.openFirstByDefault !== false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { openFirstByDefault: e.target.checked })}
                            />
                            <label htmlFor="openFirstByDefault" className="text-sm text-gray-700">
                              Open first section by default
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'flipboxes' && (
                        <>
                          {/* Flipbox Layout */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flipbox Layout
                            </label>
                            <select 
                              value={selectedBlock.settings?.layout || '3-columns'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { layout: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="2-columns">2 Columns</option>
                              <option value="3-columns">3 Columns</option>
                              <option value="4-columns">4 Columns</option>
                            </select>
                          </div>

                          {/* Flipboxes Management */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flipboxes
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.flipboxes || []).map((flipbox: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Flipbox {index + 1}</span>
                                    <button
                                      onClick={() => {
                                        const newFlipboxes = [...(selectedBlock.settings?.flipboxes || [])];
                                        newFlipboxes.splice(index, 1);
                                        updateBlockSettings(selectedBlock.id, { flipboxes: newFlipboxes });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  
                                  {/* Front Side */}
                                  <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Front Side</label>
                                    <input 
                                      type="text" 
                                      value={flipbox.frontTitle || ''}
                                      onChange={(e) => {
                                        const newFlipboxes = [...(selectedBlock.settings?.flipboxes || [])];
                                        newFlipboxes[index] = { ...newFlipboxes[index], frontTitle: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { flipboxes: newFlipboxes });
                                      }}
                                      placeholder="Front Title"
                                      className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <textarea 
                                      value={flipbox.frontContent || ''}
                                      onChange={(e) => {
                                        const newFlipboxes = [...(selectedBlock.settings?.flipboxes || [])];
                                        newFlipboxes[index] = { ...newFlipboxes[index], frontContent: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { flipboxes: newFlipboxes });
                                      }}
                                      placeholder="Front Content"
                                      rows={2}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>

                                  {/* Back Side */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Back Side</label>
                                    <input 
                                      type="text" 
                                      value={flipbox.backTitle || ''}
                                      onChange={(e) => {
                                        const newFlipboxes = [...(selectedBlock.settings?.flipboxes || [])];
                                        newFlipboxes[index] = { ...newFlipboxes[index], backTitle: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { flipboxes: newFlipboxes });
                                      }}
                                      placeholder="Back Title"
                                      className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    <textarea 
                                      value={flipbox.backContent || ''}
                                      onChange={(e) => {
                                        const newFlipboxes = [...(selectedBlock.settings?.flipboxes || [])];
                                        newFlipboxes[index] = { ...newFlipboxes[index], backContent: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { flipboxes: newFlipboxes });
                                      }}
                                      placeholder="Back Content"
                                      rows={2}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const currentFlipboxes = selectedBlock.settings?.flipboxes || [];
                                const newFlipbox = {
                                  frontTitle: `Flipbox ${currentFlipboxes.length + 1}`,
                                  frontContent: 'Front side content goes here...',
                                  backTitle: `Back ${currentFlipboxes.length + 1}`,
                                  backContent: 'Back side content goes here...'
                                };
                                updateBlockSettings(selectedBlock.id, { flipboxes: [...currentFlipboxes, newFlipbox] });
                              }}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              + Add Flipbox
                            </button>
                          </div>

                          {/* Flip Trigger */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flip Trigger
                            </label>
                            <select 
                              value={selectedBlock.settings?.flipTrigger || 'hover'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { flipTrigger: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="hover">Hover</option>
                              <option value="click">Click</option>
                            </select>
                          </div>

                          {/* Flipbox Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flipbox Colors
                            </label>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Front Side Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.frontColor || '#3b82f6'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { frontColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.frontColor || '#3b82f6'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { frontColor: e.target.value })}
                                    placeholder="#3b82f6"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Back Side Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.backColor || '#10b981'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.backColor || '#10b981'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backColor: e.target.value })}
                                    placeholder="#10b981"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'tabs' && (
                        <>
                          {/* Tab Content Management */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tab Content
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.tabs || []).map((tab: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Tab {index + 1}</span>
                                    <button
                                      onClick={() => {
                                        const newTabs = [...(selectedBlock.settings?.tabs || [])];
                                        newTabs.splice(index, 1);
                                        updateBlockSettings(selectedBlock.id, { tabs: newTabs });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <input 
                                    type="text" 
                                    value={tab.title || ''}
                                    onChange={(e) => {
                                      const newTabs = [...(selectedBlock.settings?.tabs || [])];
                                      newTabs[index] = { ...newTabs[index], title: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { tabs: newTabs });
                                    }}
                                    placeholder={`Tab ${index + 1} Title`}
                                    className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  <textarea 
                                    value={tab.content || ''}
                                    onChange={(e) => {
                                      const newTabs = [...(selectedBlock.settings?.tabs || [])];
                                      newTabs[index] = { ...newTabs[index], content: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { tabs: newTabs });
                                    }}
                                    placeholder={`Tab ${index + 1} Content`}
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const currentTabs = selectedBlock.settings?.tabs || [];
                                const newTab = {
                                  title: `Tab ${currentTabs.length + 1}`,
                                  content: 'Enter your tab content here...'
                                };
                                updateBlockSettings(selectedBlock.id, { tabs: [...currentTabs, newTab] });
                              }}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              + Add Tab
                            </button>
                          </div>

                          {/* Tab Style */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tab Style
                            </label>
                            <select 
                              value={selectedBlock.settings?.tabStyle || 'horizontal'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { tabStyle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="horizontal">Horizontal</option>
                              <option value="vertical">Vertical</option>
                            </select>
                          </div>

                          {/* Default Active Tab */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Default Active Tab
                            </label>
                            <select 
                              value={selectedBlock.settings?.defaultActiveTab || 0}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { defaultActiveTab: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {(selectedBlock.settings?.tabs || []).map((tab: any, index: number) => (
                                <option key={index} value={index}>
                                  {tab.title || `Tab ${index + 1}`}
                                </option>
                              ))}
                              {(!selectedBlock.settings?.tabs || selectedBlock.settings.tabs.length === 0) && (
                                <option value={0}>No tabs available</option>
                              )}
                            </select>
                          </div>

                          {/* Tab Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tab Colors
                            </label>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Active Tab Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.activeTabColor || '#3b82f6'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { activeTabColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.activeTabColor || '#3b82f6'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { activeTabColor: e.target.value })}
                                    placeholder="#3b82f6"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Inactive Tab Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.inactiveTabColor || '#6b7280'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { inactiveTabColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.inactiveTabColor || '#6b7280'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { inactiveTabColor: e.target.value })}
                                    placeholder="#6b7280"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'quiz' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quiz Title
                            </label>
                            <input 
                              type="text" 
                              value={selectedBlock.settings?.title || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { title: e.target.value })}
                              placeholder="Enter quiz title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Questions
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]).map((questionData: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                                    {(selectedBlock.settings?.questions?.length || 1) > 1 && (
                                      <button
                                        onClick={() => {
                                          const questions = [...(selectedBlock.settings?.questions || [])];
                                          questions.splice(index, 1);
                                          updateBlockSettings(selectedBlock.id, { questions });
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <input 
                                    type="text" 
                                    value={questionData.question || ''}
                                    onChange={(e) => {
                                      const questions = [...(selectedBlock.settings?.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])];
                                      questions[index] = { ...questions[index], question: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { questions });
                                    }}
                                    placeholder={`Question ${index + 1}`}
                                    className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                  <div className="space-y-1">
                                    {['A', 'B', 'C', 'D'].map((letter, optIndex) => (
                                      <input 
                                        key={optIndex}
                                        type="text" 
                                        value={questionData.options?.[optIndex] || ''}
                                        onChange={(e) => {
                                          const questions = [...(selectedBlock.settings?.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])];
                                          const options = [...(questions[index].options || ['', '', '', ''])];
                                          options[optIndex] = e.target.value;
                                          questions[index] = { ...questions[index], options };
                                          updateBlockSettings(selectedBlock.id, { questions });
                                        }}
                                        placeholder={`Option ${letter}`}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                    ))}
                                  </div>
                                  <select 
                                    value={questionData.correctAnswer || 0}
                                    onChange={(e) => {
                                      const questions = [...(selectedBlock.settings?.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }])];
                                      questions[index] = { ...questions[index], correctAnswer: parseInt(e.target.value) };
                                      updateBlockSettings(selectedBlock.id, { questions });
                                    }}
                                    className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  >
                                    <option value={0}>Correct Answer: Option A</option>
                                    <option value={1}>Correct Answer: Option B</option>
                                    <option value={2}>Correct Answer: Option C</option>
                                    <option value={3}>Correct Answer: Option D</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const questions = [...(selectedBlock.settings?.questions || [])];
                                questions.push({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
                                updateBlockSettings(selectedBlock.id, { questions });
                              }}
                              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400"
                            >
                              + Add Question
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quiz Settings
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="showResults" defaultChecked />
                                <label htmlFor="showResults" className="text-sm text-gray-700">
                                  Show results after completion
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="allowRetake" />
                                <label htmlFor="allowRetake" className="text-sm text-gray-700">
                                  Allow retake
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="randomizeQuestions" />
                                <label htmlFor="randomizeQuestions" className="text-sm text-gray-700">
                                  Randomize question order
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Passing Score (%)
                            </label>
                            <input 
                              type="number" 
                              placeholder="70"
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'multi-column' && (
                        <>
                          {/* Column Layout */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Column Layout
                            </label>
                            <select 
                              value={selectedBlock.settings?.layout || '2-columns-50-50'}
                              onChange={(e) => {
                                const layout = e.target.value;
                                const columnCount = layout.includes('2-columns') ? 2 : 
                                                  layout.includes('3-columns') ? 3 : 4;
                                
                                // Create default columns if they don't exist or count changed
                                const currentColumns = selectedBlock.settings?.columns || [];
                                const newColumns = [];
                                
                                for (let i = 0; i < columnCount; i++) {
                                  newColumns.push(currentColumns[i] || {
                                    content: `This is content for column ${i + 1}. You can edit this text and add any content you need.`
                                  });
                                }
                                
                                updateBlockSettings(selectedBlock.id, { 
                                  layout: layout,
                                  columns: newColumns
                                });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="2-columns-50-50">2 Columns (50/50)</option>
                              <option value="2-columns-60-40">2 Columns (60/40)</option>
                              <option value="2-columns-70-30">2 Columns (70/30)</option>
                              <option value="3-columns-33-33-33">3 Columns (33/33/33)</option>
                              <option value="3-columns-50-25-25">3 Columns (50/25/25)</option>
                              <option value="4-columns-25-25-25-25">4 Columns (25/25/25/25)</option>
                            </select>
                          </div>

                          {/* Column Content */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Column Content
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.columns || []).map((column: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">Column {index + 1}</span>
                                    <div className="text-xs text-gray-500">
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 0 && selectedBlock.settings.layout.includes('50-50') && '50%'}
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 1 && selectedBlock.settings.layout.includes('50-50') && '50%'}
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 0 && selectedBlock.settings.layout.includes('60-40') && '60%'}
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 1 && selectedBlock.settings.layout.includes('60-40') && '40%'}
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 0 && selectedBlock.settings.layout.includes('70-30') && '70%'}
                                      {selectedBlock.settings?.layout?.includes('2-columns') && index === 1 && selectedBlock.settings.layout.includes('70-30') && '30%'}
                                      {selectedBlock.settings?.layout?.includes('3-columns') && selectedBlock.settings.layout.includes('33-33-33') && '33%'}
                                      {selectedBlock.settings?.layout?.includes('3-columns') && index === 0 && selectedBlock.settings.layout.includes('50-25-25') && '50%'}
                                      {selectedBlock.settings?.layout?.includes('3-columns') && index > 0 && selectedBlock.settings.layout.includes('50-25-25') && '25%'}
                                      {selectedBlock.settings?.layout?.includes('4-columns') && '25%'}
                                    </div>
                                  </div>
                                  <textarea 
                                    value={column.content || ''}
                                    onChange={(e) => {
                                      const newColumns = [...(selectedBlock.settings?.columns || [])];
                                      newColumns[index] = { ...newColumns[index], content: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { columns: newColumns });
                                    }}
                                    placeholder={`Enter content for column ${index + 1}`}
                                    rows={4}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Column Gap */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Column Gap
                            </label>
                            <select 
                              value={selectedBlock.settings?.gap || 'medium'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { gap: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="small">Small (8px)</option>
                              <option value="medium">Medium (16px)</option>
                              <option value="large">Large (24px)</option>
                            </select>
                          </div>

                          {/* Equal Heights */}
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="equalHeight" 
                              checked={selectedBlock.settings?.equalHeight !== false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { equalHeight: e.target.checked })}
                            />
                            <label htmlFor="equalHeight" className="text-sm text-gray-700">
                              Equal column heights
                            </label>
                          </div>

                          {/* Column Background */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Column Background
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                placeholder="#ffffff"
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                              <button
                                onClick={() => updateBlockSettings(selectedBlock.id, { backgroundColor: 'transparent' })}
                                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'card-grid' && (
                        <>
                          {/* Grid Layout */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Grid Layout
                            </label>
                            <select 
                              value={selectedBlock.settings?.layout || '3-cards'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { layout: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="2-cards">2 Cards per row</option>
                              <option value="3-cards">3 Cards per row</option>
                              <option value="4-cards">4 Cards per row</option>
                              <option value="auto-fit">Auto-fit (responsive)</option>
                            </select>
                          </div>

                          {/* Cards Management */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cards
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.cards || []).map((card: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Card {index + 1}</span>
                                    <button
                                      onClick={() => {
                                        const newCards = [...(selectedBlock.settings?.cards || [])];
                                        newCards.splice(index, 1);
                                        updateBlockSettings(selectedBlock.id, { cards: newCards });
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  
                                  {/* Card Title */}
                                  <input 
                                    type="text" 
                                    value={card.title || ''}
                                    onChange={(e) => {
                                      const newCards = [...(selectedBlock.settings?.cards || [])];
                                      newCards[index] = { ...newCards[index], title: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { cards: newCards });
                                    }}
                                    placeholder={`Card ${index + 1} Title`}
                                    className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  
                                  {/* Card Content */}
                                  <textarea 
                                    value={card.content || ''}
                                    onChange={(e) => {
                                      const newCards = [...(selectedBlock.settings?.cards || [])];
                                      newCards[index] = { ...newCards[index], content: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { cards: newCards });
                                    }}
                                    placeholder={`Card ${index + 1} Content`}
                                    rows={3}
                                    className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  />
                                  
                                  {/* Card Button */}
                                  <div className="space-y-2">
                                    <input 
                                      type="text" 
                                      value={card.buttonText || ''}
                                      onChange={(e) => {
                                        const newCards = [...(selectedBlock.settings?.cards || [])];
                                        newCards[index] = { ...newCards[index], buttonText: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { cards: newCards });
                                      }}
                                      placeholder="Button Text (optional)"
                                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    
                                    {/* Button Link */}
                                    <input 
                                      type="url" 
                                      value={card.buttonLink || ''}
                                      onChange={(e) => {
                                        const newCards = [...(selectedBlock.settings?.cards || [])];
                                        newCards[index] = { ...newCards[index], buttonLink: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { cards: newCards });
                                      }}
                                      placeholder="Button Link (https://example.com)"
                                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    
                                    {/* Link Target */}
                                    <select 
                                      value={card.buttonTarget || '_self'}
                                      onChange={(e) => {
                                        const newCards = [...(selectedBlock.settings?.cards || [])];
                                        newCards[index] = { ...newCards[index], buttonTarget: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { cards: newCards });
                                      }}
                                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="_self">Same window</option>
                                      <option value="_blank">New window</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const currentCards = selectedBlock.settings?.cards || [];
                                const newCard = {
                                  title: `Card ${currentCards.length + 1}`,
                                  content: 'Add your card content here. This can include descriptions, features, or any information you want to highlight.',
                                  buttonText: 'Learn More',
                                  buttonLink: '#',
                                  buttonTarget: '_self'
                                };
                                updateBlockSettings(selectedBlock.id, { cards: [...currentCards, newCard] });
                              }}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              + Add Card
                            </button>
                          </div>

                          {/* Card Style */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Style
                            </label>
                            <select 
                              value={selectedBlock.settings?.cardStyle || 'default'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { cardStyle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="default">Default</option>
                              <option value="bordered">Bordered</option>
                              <option value="shadowed">Shadowed</option>
                              <option value="elevated">Elevated</option>
                            </select>
                          </div>

                          {/* Card Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Colors
                            </label>
                            <div className="space-y-3">
                              {/* Background Color */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Card Background</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                    placeholder="#ffffff"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Title Color */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Title Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.titleColor || '#111827'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { titleColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.titleColor || '#111827'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { titleColor: e.target.value })}
                                    placeholder="#111827"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Text Color */}
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.textColor || '#374151'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={selectedBlock.settings?.textColor || '#374151'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                    placeholder="#374151"
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Button Colors */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Button Color</label>
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                                  <input
                                    type="color"
                                    value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Effects */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Effects
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="cardHoverEffect" 
                                  checked={selectedBlock.settings?.cardHoverEffect !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { cardHoverEffect: e.target.checked })}
                                />
                                <label htmlFor="cardHoverEffect" className="text-sm text-gray-700">
                                  Enable hover effects
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'timeline' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timeline Orientation
                            </label>
                            <select 
                              value={selectedBlock.settings?.orientation || 'vertical'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { orientation: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="vertical">Vertical</option>
                              <option value="horizontal">Horizontal</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timeline Items
                            </label>
                            <div className="space-y-3 mb-3">
                              {(selectedBlock.settings?.events || [{ title: '', date: '', description: '' }]).map((event: any, index: number) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Event {index + 1}</span>
                                    {(selectedBlock.settings?.events?.length || 1) > 1 && (
                                      <button
                                        onClick={() => {
                                          const events = [...(selectedBlock.settings?.events || [])];
                                          events.splice(index, 1);
                                          updateBlockSettings(selectedBlock.id, { events });
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <input 
                                    type="text" 
                                    value={event.title || ''}
                                    onChange={(e) => {
                                      const events = [...(selectedBlock.settings?.events || [{ title: '', date: '', description: '' }])];
                                      events[index] = { ...events[index], title: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { events });
                                    }}
                                    placeholder="Event Title"
                                    className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                  <input 
                                    type="text" 
                                    value={event.date || ''}
                                    onChange={(e) => {
                                      const events = [...(selectedBlock.settings?.events || [{ title: '', date: '', description: '' }])];
                                      events[index] = { ...events[index], date: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { events });
                                    }}
                                    placeholder="Date/Time"
                                    className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                  <textarea 
                                    value={event.description || ''}
                                    onChange={(e) => {
                                      const events = [...(selectedBlock.settings?.events || [{ title: '', date: '', description: '' }])];
                                      events[index] = { ...events[index], description: e.target.value };
                                      updateBlockSettings(selectedBlock.id, { events });
                                    }}
                                    placeholder="Event Description"
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                  />
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                const events = [...(selectedBlock.settings?.events || [])];
                                events.push({ title: '', date: '', description: '' });
                                updateBlockSettings(selectedBlock.id, { events });
                              }}
                              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400"
                            >
                              + Add Timeline Item
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Timeline Style
                            </label>
                            <select 
                              value={selectedBlock.settings?.style || 'default'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { style: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="default">Default</option>
                              <option value="minimal">Minimal</option>
                              <option value="detailed">Detailed</option>
                              <option value="modern">Modern</option>
                            </select>
                          </div>

                          {/* Color Customization */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Colors
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Primary Color</label>
                                <input
                                  type="color"
                                  value={selectedBlock.settings?.primaryColor || '#3b82f6'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { primaryColor: e.target.value })}
                                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Line Color</label>
                                <input
                                  type="color"
                                  value={selectedBlock.settings?.secondaryColor || '#e5e7eb'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { secondaryColor: e.target.value })}
                                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Display Options */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Display Options
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="showConnectors" 
                                  checked={selectedBlock.settings?.showConnectors !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { showConnectors: e.target.checked })}
                                />
                                <label htmlFor="showConnectors" className="text-sm text-gray-700">
                                  Show connecting lines
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'content-grid' && (
                        <>
                          {/* Tab Navigation */}
                          <div className="flex border-b border-gray-200 mb-4">
                            <button
                              onClick={() => setContentGridActiveTab('content')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                contentGridActiveTab === 'content'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Content
                            </button>
                            <button
                              onClick={() => setContentGridActiveTab('style')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                contentGridActiveTab === 'style'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Style
                            </button>
                          </div>

                          {/* Content Tab */}
                          {contentGridActiveTab === 'content' && (
                            <>
                              {/* Grid Items */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Grid Items
                                </label>
                                <div className="space-y-3 mb-3">
                                  {(selectedBlock.settings?.items || []).map((item: any, index: number) => (
                                    <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                                        <button
                                          onClick={() => {
                                            const items = [...(selectedBlock.settings?.items || [])];
                                            items.splice(index, 1);
                                            updateBlockSettings(selectedBlock.id, { items });
                                          }}
                                          className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                          Remove
                                        </button>
                                      </div>

                                      {/* Image Layout Selection */}
                                      <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Image Layout</label>
                                        <select
                                          value={item.imageLayout || 'none'}
                                          onChange={(e) => {
                                            const items = [...(selectedBlock.settings?.items || [])];
                                            items[index] = { ...items[index], imageLayout: e.target.value };
                                            updateBlockSettings(selectedBlock.id, { items });
                                          }}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                          <option value="none">No Image</option>
                                          <option value="top">Top Image → Title → Content</option>
                                          <option value="background">Background Image + Title + Content</option>
                                          <option value="side">Title → Image → Content</option>
                                        </select>
                                      </div>

                                      {/* Image Upload (if image layout selected) */}
                                      {item.imageLayout && item.imageLayout !== 'none' && (
                                        <div className="mb-3">
                                          <label className="block text-xs font-medium text-gray-600 mb-1">Upload Image</label>
                                          <div className="relative">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  const imageUrl = URL.createObjectURL(file);
                                                  const items = [...(selectedBlock.settings?.items || [])];
                                                  items[index] = { 
                                                    ...items[index], 
                                                    imageUrl: imageUrl,
                                                    fileName: file.name 
                                                  };
                                                  updateBlockSettings(selectedBlock.id, { items });
                                                }
                                              }}
                                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex items-center justify-between p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                              <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs text-gray-600">
                                                  {item.fileName ? item.fileName : 'Click to upload image'}
                                                </span>
                                              </div>
                                              {item.imageUrl && (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const items = [...(selectedBlock.settings?.items || [])];
                                                    items[index] = { 
                                                      ...items[index], 
                                                      imageUrl: '',
                                                      fileName: '' 
                                                    };
                                                    updateBlockSettings(selectedBlock.id, { items });
                                                  }}
                                                  className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                  Remove
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {/* Image Preview */}
                                          {item.imageUrl && (
                                            <div className="mt-2">
                                              <img 
                                                src={item.imageUrl} 
                                                alt={item.fileName || 'Uploaded image'} 
                                                className="w-full h-20 object-cover rounded border border-gray-200"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Title */}
                                      <input 
                                        type="text" 
                                        value={item.title || ''}
                                        onChange={(e) => {
                                          const items = [...(selectedBlock.settings?.items || [])];
                                          items[index] = { ...items[index], title: e.target.value };
                                          updateBlockSettings(selectedBlock.id, { items });
                                        }}
                                        placeholder={`Item ${index + 1} Title`}
                                        className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />

                                      {/* Content */}
                                      <textarea 
                                        value={item.content || ''}
                                        onChange={(e) => {
                                          const items = [...(selectedBlock.settings?.items || [])];
                                          items[index] = { ...items[index], content: e.target.value };
                                          updateBlockSettings(selectedBlock.id, { items });
                                        }}
                                        placeholder={`Item ${index + 1} Content`}
                                        rows={3}
                                        className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />

                                      {/* Button Settings */}
                                      <div className="border-t border-gray-200 pt-3">
                                        <label className="block text-xs font-medium text-gray-600 mb-2">Button (Optional)</label>
                                        
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                          <input
                                            type="text"
                                            value={item.buttonText || ''}
                                            onChange={(e) => {
                                              const items = [...(selectedBlock.settings?.items || [])];
                                              items[index] = { ...items[index], buttonText: e.target.value };
                                              updateBlockSettings(selectedBlock.id, { items });
                                            }}
                                            placeholder="Button Text"
                                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                          />
                                          <input
                                            type="url"
                                            value={item.buttonLink || ''}
                                            onChange={(e) => {
                                              const items = [...(selectedBlock.settings?.items || [])];
                                              items[index] = { ...items[index], buttonLink: e.target.value };
                                              updateBlockSettings(selectedBlock.id, { items });
                                            }}
                                            placeholder="Button Link"
                                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                          />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <select
                                            value={item.buttonTarget || '_self'}
                                            onChange={(e) => {
                                              const items = [...(selectedBlock.settings?.items || [])];
                                              items[index] = { ...items[index], buttonTarget: e.target.value };
                                              updateBlockSettings(selectedBlock.id, { items });
                                            }}
                                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                          >
                                            <option value="_self">Same Tab</option>
                                            <option value="_blank">New Tab</option>
                                          </select>
                                          <select
                                            value={item.buttonAlign || 'left'}
                                            onChange={(e) => {
                                              const items = [...(selectedBlock.settings?.items || [])];
                                              items[index] = { ...items[index], buttonAlign: e.target.value };
                                              updateBlockSettings(selectedBlock.id, { items });
                                            }}
                                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                          >
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <button 
                                  onClick={() => {
                                    const items = [...(selectedBlock.settings?.items || [])];
                                    items.push({ 
                                      title: `Item ${items.length + 1}`,
                                      content: 'Add your content here...',
                                      imageLayout: 'none',
                                      buttonAlign: 'left',
                                      buttonTarget: '_self'
                                    });
                                    updateBlockSettings(selectedBlock.id, { items });
                                  }}
                                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                >
                                  + Add Grid Item
                                </button>
                              </div>
                            </>
                          )}

                          {/* Style Tab */}
                          {contentGridActiveTab === 'style' && (
                            <>
                              {/* Grid Configuration */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Grid Configuration
                                </label>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Columns</label>
                                    <select 
                                      value={selectedBlock.settings?.columns || '3'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { columns: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="2">2 Columns</option>
                                      <option value="3">3 Columns</option>
                                      <option value="4">4 Columns</option>
                                      <option value="6">6 Columns</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Gap</label>
                                    <select 
                                      value={selectedBlock.settings?.gap || 'medium'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { gap: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="small">Small</option>
                                      <option value="medium">Medium</option>
                                      <option value="large">Large</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Card Styling */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Card Style
                                </label>
                                <select
                                  value={selectedBlock.settings?.cardStyle || 'default'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { cardStyle: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="default">Default</option>
                                  <option value="bordered">Bordered</option>
                                  <option value="shadowed">Shadowed</option>
                                  <option value="elevated">Elevated</option>
                                </select>
                              </div>

                              {/* Button Colors */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Button Colors
                                </label>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                        placeholder="#3b82f6"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Text Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                        placeholder="#ffffff"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Button Hover Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.buttonHoverColor || '#2563eb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonHoverColor: e.target.value })}
                                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.buttonHoverColor || '#2563eb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonHoverColor: e.target.value })}
                                        placeholder="#2563eb"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Layout Options */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="equalItemHeight" 
                                    checked={selectedBlock.settings?.equalItemHeight || false}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { equalItemHeight: e.target.checked })}
                                  />
                                  <label htmlFor="equalItemHeight" className="text-sm text-gray-700">
                                    Equal item heights
                                  </label>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {selectedBlock.type === 'rich-text' && (
                        <>
                          {/* Tab Navigation */}
                          <div className="flex border-b border-gray-200 mb-4">
                            <button
                              onClick={() => setRichTextActiveTab('content')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                richTextActiveTab === 'content'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Content
                            </button>
                            <button
                              onClick={() => setRichTextActiveTab('style')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                richTextActiveTab === 'style'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Style
                            </button>
                          </div>

                          {/* Content Tab */}
                          {richTextActiveTab === 'content' && (
                            <>
                              {/* Rich Text Editor */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Rich Text Content
                                </label>
                                
                                {/* Advanced Toolbar */}
                                <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2">
                                  <div className="flex flex-wrap items-center gap-1">
                                    {/* Text Formatting */}
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('bold', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 font-bold"
                                      title="Bold"
                                    >
                                      B
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('italic', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 italic"
                                      title="Italic"
                                    >
                                      I
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('underline', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200 underline"
                                      title="Underline"
                                    >
                                      U
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('strikeThrough', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Strikethrough"
                                      style={{ textDecoration: 'line-through' }}
                                    >
                                      S
                                    </button>
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Headings */}
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          document.execCommand('formatBlock', false, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                      className="text-xs border border-gray-300 rounded px-2 py-1"
                                    >
                                      <option value="">Format</option>
                                      <option value="h1">Heading 1</option>
                                      <option value="h2">Heading 2</option>
                                      <option value="h3">Heading 3</option>
                                      <option value="h4">Heading 4</option>
                                      <option value="p">Paragraph</option>
                                      <option value="blockquote">Quote</option>
                                    </select>
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Alignment */}
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('justifyLeft', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Align Left"
                                    >
                                      ⬅
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('justifyCenter', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Align Center"
                                    >
                                      ↔
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('justifyRight', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Align Right"
                                    >
                                      ➡
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('justifyFull', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Justify"
                                    >
                                      ⬌
                                    </button>
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Lists */}
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('insertUnorderedList', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Bullet List"
                                    >
                                      •
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('insertOrderedList', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Numbered List"
                                    >
                                      1.
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('outdent', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Decrease Indent"
                                    >
                                      ⬅
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('indent', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Increase Indent"
                                    >
                                      ➡
                                    </button>
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Links and Media */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const url = prompt('Enter URL:');
                                        if (url) {
                                          document.execCommand('createLink', false, url);
                                        }
                                      }}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Insert Link"
                                    >
                                      🔗
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('unlink', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Remove Link"
                                    >
                                      🔗❌
                                    </button>
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Colors */}
                                    <input
                                      type="color"
                                      onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
                                      className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                                      title="Text Color"
                                    />
                                    <input
                                      type="color"
                                      onChange={(e) => document.execCommand('backColor', false, e.target.value)}
                                      className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                                      title="Background Color"
                                    />
                                    
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    
                                    {/* Utilities */}
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('removeFormat', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Clear Formatting"
                                    >
                                      🧹
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('undo', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Undo"
                                    >
                                      ↶
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => document.execCommand('redo', false)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-200"
                                      title="Redo"
                                    >
                                      ↷
                                    </button>
                                  </div>
                                </div>

                                {/* Content Editor */}
                                <div
                                  contentEditable
                                  suppressContentEditableWarning={true}
                                  onInput={(e) => {
                                    const content = e.currentTarget.innerHTML;
                                    updateBlockSettings(selectedBlock.id, { content });
                                  }}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData('text/plain');
                                    document.execCommand('insertText', false, text);
                                  }}
                                  className="w-full min-h-[300px] p-4 border border-gray-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-500 prose prose-sm max-w-none"
                                  style={{ 
                                    whiteSpace: 'pre-wrap',
                                    fontSize: selectedBlock.settings?.fontSize || '16px',
                                    fontFamily: selectedBlock.settings?.fontFamily || 'Inter, system-ui, sans-serif',
                                    lineHeight: selectedBlock.settings?.lineHeight || '1.6',
                                    color: selectedBlock.settings?.textColor || '#374151'
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: selectedBlock.settings?.content || '<p>Start typing your content here...</p>'
                                  }}
                                />
                              </div>

                              {/* Content Options */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="enableSpellCheck" 
                                    checked={selectedBlock.settings?.enableSpellCheck || false}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { enableSpellCheck: e.target.checked })}
                                  />
                                  <label htmlFor="enableSpellCheck" className="text-sm text-gray-700">
                                    Enable spell check
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="showWordCount" 
                                    checked={selectedBlock.settings?.showWordCount || false}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { showWordCount: e.target.checked })}
                                  />
                                  <label htmlFor="showWordCount" className="text-sm text-gray-700">
                                    Show word count
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="allowImageUpload" 
                                    checked={selectedBlock.settings?.allowImageUpload || false}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { allowImageUpload: e.target.checked })}
                                  />
                                  <label htmlFor="allowImageUpload" className="text-sm text-gray-700">
                                    Allow image uploads
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id="allowLinkInsertion" 
                                    checked={selectedBlock.settings?.allowLinkInsertion || false}
                                    onChange={(e) => updateBlockSettings(selectedBlock.id, { allowLinkInsertion: e.target.checked })}
                                  />
                                  <label htmlFor="allowLinkInsertion" className="text-sm text-gray-700">
                                    Allow link insertion
                                  </label>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Style Tab */}
                          {richTextActiveTab === 'style' && (
                            <>
                              {/* Typography */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Typography
                                </label>
                                <div className="space-y-3">
                                  {/* Font Family */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                                    <select 
                                      value={selectedBlock.settings?.fontFamily || 'Inter, system-ui, sans-serif'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { fontFamily: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="Inter, system-ui, sans-serif">Inter (Default)</option>
                                      <option value="Arial, sans-serif">Arial</option>
                                      <option value="Helvetica, sans-serif">Helvetica</option>
                                      <option value="Georgia, serif">Georgia</option>
                                      <option value="Times New Roman, serif">Times New Roman</option>
                                      <option value="Courier New, monospace">Courier New</option>
                                      <option value="Verdana, sans-serif">Verdana</option>
                                      <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                                    </select>
                                  </div>

                                  {/* Font Size */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                                    <select 
                                      value={selectedBlock.settings?.fontSize || '16px'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { fontSize: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="12px">12px - Small</option>
                                      <option value="14px">14px - Default Small</option>
                                      <option value="16px">16px - Default</option>
                                      <option value="18px">18px - Large</option>
                                      <option value="20px">20px - Extra Large</option>
                                      <option value="24px">24px - Heading</option>
                                    </select>
                                  </div>

                                  {/* Line Height */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Line Height</label>
                                    <select 
                                      value={selectedBlock.settings?.lineHeight || '1.6'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { lineHeight: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="1.2">1.2 - Tight</option>
                                      <option value="1.4">1.4 - Snug</option>
                                      <option value="1.6">1.6 - Normal</option>
                                      <option value="1.8">1.8 - Relaxed</option>
                                      <option value="2.0">2.0 - Loose</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Colors */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Colors
                                </label>
                                <div className="space-y-3">
                                  {/* Text Color */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.textColor || '#374151'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.textColor || '#374151'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                        placeholder="#374151"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Background Color */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={selectedBlock.settings?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { backgroundColor: e.target.value })}
                                        placeholder="#ffffff"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { backgroundColor: 'transparent' })}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Layout */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Layout & Spacing
                                </label>
                                <div className="space-y-3">
                                  {/* Text Alignment */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Text Alignment</label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { textAlign: 'left' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.textAlign === 'left' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Left
                                      </button>
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { textAlign: 'center' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.textAlign === 'center' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Center
                                      </button>
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { textAlign: 'right' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.textAlign === 'right' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Right
                                      </button>
                                      <button
                                        onClick={() => updateBlockSettings(selectedBlock.id, { textAlign: 'justify' })}
                                        className={`flex-1 px-3 py-2 text-sm border rounded-md ${
                                          selectedBlock.settings?.textAlign === 'justify' 
                                            ? 'bg-primary-500 text-white border-primary-500' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                      >
                                        Justify
                                      </button>
                                    </div>
                                  </div>

                                  {/* Padding */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Padding</label>
                                    <select 
                                      value={selectedBlock.settings?.padding || '24px'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { padding: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="0px">None</option>
                                      <option value="8px">Small (8px)</option>
                                      <option value="16px">Medium (16px)</option>
                                      <option value="24px">Large (24px)</option>
                                      <option value="32px">Extra Large (32px)</option>
                                      <option value="48px">Huge (48px)</option>
                                    </select>
                                  </div>

                                  {/* Border Radius */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                                    <select 
                                      value={selectedBlock.settings?.borderRadius || '8px'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { borderRadius: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="0px">None</option>
                                      <option value="4px">Small (4px)</option>
                                      <option value="8px">Medium (8px)</option>
                                      <option value="12px">Large (12px)</option>
                                      <option value="16px">Extra Large (16px)</option>
                                    </select>
                                  </div>

                                  {/* Max Width */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Max Width</label>
                                    <select 
                                      value={selectedBlock.settings?.maxWidth || '100%'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { maxWidth: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="100%">Full Width</option>
                                      <option value="800px">800px</option>
                                      <option value="600px">600px</option>
                                      <option value="400px">400px</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Custom CSS */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Custom CSS
                                </label>
                                <textarea 
                                  value={selectedBlock.settings?.customCSS || ''}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { customCSS: e.target.value })}
                                  placeholder="/* Add custom CSS here */\n.rich-text-content {\n  /* Your styles */\n}"
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {selectedBlock.type === 'data-table' && (
                        <>
                          {/* Tab Navigation */}
                          <div className="flex border-b border-gray-200 mb-4">
                            <button
                              onClick={() => setDataTableActiveTab('content')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                dataTableActiveTab === 'content'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Content
                            </button>
                            <button
                              onClick={() => setDataTableActiveTab('style')}
                              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                dataTableActiveTab === 'style'
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Style
                            </button>
                          </div>

                          {/* Content Tab */}
                          {dataTableActiveTab === 'content' && (
                            <>
                              {/* Table Configuration */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Table Configuration
                                </label>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-xs text-gray-600">Rows</label>
                                <input 
                                  type="number" 
                                  value={selectedBlock.settings?.rowCount || 3}
                                  onChange={(e) => {
                                    const rowCount = parseInt(e.target.value) || 1;
                                    const currentRows = selectedBlock.settings?.rows || [];
                                    const currentHeaders = selectedBlock.settings?.headers || [];
                                    const colCount = selectedBlock.settings?.colCount || 3;
                                    
                                    // Adjust rows array
                                    const newRows = Array(rowCount).fill(null).map((_, i) => 
                                      currentRows[i] || Array(colCount).fill('')
                                    );
                                    
                                    updateBlockSettings(selectedBlock.id, { 
                                      rowCount, 
                                      rows: newRows,
                                      headers: currentHeaders.length ? currentHeaders : Array(colCount).fill('')
                                    });
                                  }}
                                  min="1"
                                  max="20"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Columns</label>
                                <input 
                                  type="number" 
                                  value={selectedBlock.settings?.colCount || 3}
                                  onChange={(e) => {
                                    const colCount = parseInt(e.target.value) || 1;
                                    const currentRows = selectedBlock.settings?.rows || [];
                                    const currentHeaders = selectedBlock.settings?.headers || [];
                                    const rowCount = selectedBlock.settings?.rowCount || 3;
                                    
                                    // Adjust headers and rows arrays
                                    const newHeaders = Array(colCount).fill('').map((_, i) => currentHeaders[i] || '');
                                    const newRows = Array(rowCount).fill(null).map((_, i) => 
                                      Array(colCount).fill('').map((_, j) => (currentRows[i] && currentRows[i][j]) || '')
                                    );
                                    
                                    updateBlockSettings(selectedBlock.id, { 
                                      colCount, 
                                      headers: newHeaders,
                                      rows: newRows 
                                    });
                                  }}
                                  min="1"
                                  max="10"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Table Data
                            </label>
                            
                            {/* Navigation Instructions */}
                            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center gap-2 text-xs text-blue-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Navigation Tips:</span>
                                <span>Tab → Next cell</span>
                                <span>•</span>
                                <span>Shift+Tab → Previous cell</span>
                                <span>•</span>
                                <span>Enter → Next row</span>
                                <span>•</span>
                                <span>Arrow keys → Navigate</span>
                              </div>
                            </div>

                            <div className="border border-gray-300 rounded-md p-3 mb-3 max-h-64 overflow-y-auto">
                              {/* Headers */}
                              <div className={`grid gap-1 mb-2`} style={{ gridTemplateColumns: `repeat(${selectedBlock.settings?.colCount || 3}, 1fr)` }}>
                                {(selectedBlock.settings?.headers || Array(3).fill('')).map((header: string, colIndex: number) => (
                                  <input 
                                    key={`header-${colIndex}`}
                                    value={header}
                                    onChange={(e) => {
                                      const headers = [...(selectedBlock.settings?.headers || Array(selectedBlock.settings?.colCount || 3).fill(''))];
                                      headers[colIndex] = e.target.value;
                                      updateBlockSettings(selectedBlock.id, { headers });
                                    }}
                                    onKeyDown={(e) => {
                                      const totalCols = selectedBlock.settings?.colCount || 3;
                                      if (e.key === 'Tab') {
                                        // Tab navigation is handled by browser
                                      } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        // Move to first data cell
                                        const firstDataCell = document.querySelector(`input[data-cell="0-0"]`) as HTMLInputElement;
                                        if (firstDataCell) firstDataCell.focus();
                                      } else if (e.key === 'ArrowRight' && colIndex < totalCols - 1) {
                                        e.preventDefault();
                                        const nextInput = document.querySelector(`input[key="header-${colIndex + 1}"]`) as HTMLInputElement;
                                        if (nextInput) nextInput.focus();
                                      } else if (e.key === 'ArrowLeft' && colIndex > 0) {
                                        e.preventDefault();
                                        const prevInput = document.querySelector(`input[key="header-${colIndex - 1}"]`) as HTMLInputElement;
                                        if (prevInput) prevInput.focus();
                                      }
                                    }}
                                    placeholder={`Header ${colIndex + 1}`} 
                                    className="px-2 py-1 text-xs border border-gray-200 rounded font-medium bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                                  />
                                ))}
                              </div>
                              
                              {/* Data Rows */}
                              {(selectedBlock.settings?.rows || Array(3).fill(null).map(() => Array(3).fill(''))).map((row: string[], rowIndex: number) => (
                                <div key={`row-${rowIndex}`} className={`grid gap-1 mb-1`} style={{ gridTemplateColumns: `repeat(${selectedBlock.settings?.colCount || 3}, 1fr)` }}>
                                  {row.map((cell: string, colIndex: number) => (
                                    <input 
                                      key={`cell-${rowIndex}-${colIndex}`}
                                      data-cell={`${rowIndex}-${colIndex}`}
                                      value={cell}
                                      onChange={(e) => {
                                        const rows = [...(selectedBlock.settings?.rows || [])];
                                        if (!rows[rowIndex]) rows[rowIndex] = [];
                                        rows[rowIndex][colIndex] = e.target.value;
                                        updateBlockSettings(selectedBlock.id, { rows });
                                      }}
                                      onKeyDown={(e) => {
                                        const totalRows = selectedBlock.settings?.rowCount || 3;
                                        const totalCols = selectedBlock.settings?.colCount || 3;
                                        
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          // Move to next row, same column
                                          if (rowIndex < totalRows - 1) {
                                            const nextRowCell = document.querySelector(`input[data-cell="${rowIndex + 1}-${colIndex}"]`) as HTMLInputElement;
                                            if (nextRowCell) nextRowCell.focus();
                                          } else {
                                            // If last row, move to first column of next row or first cell
                                            const firstCell = document.querySelector(`input[data-cell="0-0"]`) as HTMLInputElement;
                                            if (firstCell) firstCell.focus();
                                          }
                                        } else if (e.key === 'ArrowRight' && colIndex < totalCols - 1) {
                                          e.preventDefault();
                                          const nextCell = document.querySelector(`input[data-cell="${rowIndex}-${colIndex + 1}"]`) as HTMLInputElement;
                                          if (nextCell) nextCell.focus();
                                        } else if (e.key === 'ArrowLeft' && colIndex > 0) {
                                          e.preventDefault();
                                          const prevCell = document.querySelector(`input[data-cell="${rowIndex}-${colIndex - 1}"]`) as HTMLInputElement;
                                          if (prevCell) prevCell.focus();
                                        } else if (e.key === 'ArrowUp' && rowIndex > 0) {
                                          e.preventDefault();
                                          const upCell = document.querySelector(`input[data-cell="${rowIndex - 1}-${colIndex}"]`) as HTMLInputElement;
                                          if (upCell) upCell.focus();
                                        } else if (e.key === 'ArrowDown' && rowIndex < totalRows - 1) {
                                          e.preventDefault();
                                          const downCell = document.querySelector(`input[data-cell="${rowIndex + 1}-${colIndex}"]`) as HTMLInputElement;
                                          if (downCell) downCell.focus();
                                        }
                                      }}
                                      onFocus={(e) => {
                                        // Add visual focus indicator
                                        e.target.classList.add('ring-2', 'ring-primary-500', 'border-primary-500');
                                      }}
                                      onBlur={(e) => {
                                        // Remove visual focus indicator
                                        e.target.classList.remove('ring-2', 'ring-primary-500', 'border-primary-500');
                                      }}
                                      placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`} 
                                      className="px-2 py-1 text-xs border border-gray-200 rounded hover:border-gray-300 focus:outline-none transition-colors" 
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                              <button
                                onClick={() => {
                                  const firstCell = document.querySelector(`input[data-cell="0-0"]`) as HTMLInputElement;
                                  if (firstCell) firstCell.focus();
                                }}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                              >
                                Focus First Cell
                              </button>
                              <span>•</span>
                              <span>Click any cell to start editing</span>
                            </div>
                          </div>

                              {/* Features */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Table Features
                                </label>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="sortableTable" 
                                      checked={selectedBlock.settings?.enableSorting || false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { enableSorting: e.target.checked })}
                                    />
                                    <label htmlFor="sortableTable" className="text-sm text-gray-700">
                                      Enable sorting
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="searchableTable" 
                                      checked={selectedBlock.settings?.enableSearch || false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { enableSearch: e.target.checked })}
                                    />
                                    <label htmlFor="searchableTable" className="text-sm text-gray-700">
                                      Enable search
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="paginationTable" 
                                      checked={selectedBlock.settings?.enablePagination || false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { enablePagination: e.target.checked })}
                                    />
                                    <label htmlFor="paginationTable" className="text-sm text-gray-700">
                                      Enable pagination
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Pagination Settings */}
                              {selectedBlock.settings?.enablePagination && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rows Per Page
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={selectedBlock.settings?.rowsPerPage || 10}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        const clampedValue = Math.max(1, Math.min(1000, value)); // Min 1, Max 1000
                                        updateBlockSettings(selectedBlock.id, { rowsPerPage: clampedValue });
                                      }}
                                      min="1"
                                      max="1000"
                                      placeholder="10"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    <span className="text-sm text-gray-500 whitespace-nowrap">rows per page</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Enter a number between 1 and 1000. Common values: 5, 10, 25, 50, 100
                                  </p>
                                </div>
                              )}
                            </>
                          )}

                          {/* Style Tab */}
                          {dataTableActiveTab === 'style' && (
                            <>
                              {/* Table Style */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Table Style
                                </label>
                                <select 
                                  value={selectedBlock.settings?.tableStyle || 'bordered'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { tableStyle: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="default">Default</option>
                                  <option value="bordered">Bordered</option>
                                  <option value="striped">Striped</option>
                                  <option value="minimal">Minimal</option>
                                  <option value="modern">Modern</option>
                                </select>
                              </div>

                              {/* Header Style */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Header Style
                                </label>
                                <select 
                                  value={selectedBlock.settings?.headerStyle || 'dark'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { headerStyle: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="dark">Dark</option>
                                  <option value="light">Light</option>
                                  <option value="primary">Primary Color</option>
                                  <option value="custom">Custom</option>
                                </select>
                              </div>

                              {/* Colors */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Colors
                                </label>
                                <div className="space-y-3">
                                  {/* Header Colors */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Header Background</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.headerBackgroundColor || '#374151'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { headerBackgroundColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Header Text</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.headerTextColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { headerTextColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                  </div>

                                  {/* Row Colors */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Row Background</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.rowBackgroundColor || '#ffffff'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { rowBackgroundColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Alternate Row</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.alternateRowColor || '#f9fafb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { alternateRowColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                  </div>

                                  {/* Text and Border Colors */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.textColor || '#374151'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { textColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Border Color</label>
                                      <input
                                        type="color"
                                        value={selectedBlock.settings?.borderColor || '#e5e7eb'}
                                        onChange={(e) => updateBlockSettings(selectedBlock.id, { borderColor: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Typography */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Typography
                                </label>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                                    <select 
                                      value={selectedBlock.settings?.fontSize || '14px'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { fontSize: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="12px">12px - Small</option>
                                      <option value="14px">14px - Default</option>
                                      <option value="16px">16px - Large</option>
                                      <option value="18px">18px - Extra Large</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Cell Padding</label>
                                    <select 
                                      value={selectedBlock.settings?.cellPadding || 'medium'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { cellPadding: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="small">Small (8px)</option>
                                      <option value="medium">Medium (12px)</option>
                                      <option value="large">Large (16px)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Layout Options */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Layout Options
                                </label>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Table Width</label>
                                    <select 
                                      value={selectedBlock.settings?.tableWidth || '100%'}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { tableWidth: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                      <option value="100%">Full Width</option>
                                      <option value="auto">Auto Width</option>
                                      <option value="800px">800px</option>
                                      <option value="600px">600px</option>
                                    </select>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="alternateRows" 
                                      checked={selectedBlock.settings?.alternateRows || false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { alternateRows: e.target.checked })}
                                    />
                                    <label htmlFor="alternateRows" className="text-sm text-gray-700">
                                      Alternate row colors
                                    </label>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="showBorders" 
                                      checked={selectedBlock.settings?.showBorders !== false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { showBorders: e.target.checked })}
                                    />
                                    <label htmlFor="showBorders" className="text-sm text-gray-700">
                                      Show borders
                                    </label>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      id="compactMode" 
                                      checked={selectedBlock.settings?.compactMode || false}
                                      onChange={(e) => updateBlockSettings(selectedBlock.id, { compactMode: e.target.checked })}
                                    />
                                    <label htmlFor="compactMode" className="text-sm text-gray-700">
                                      Compact mode
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {selectedBlock.type === 'code-block' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Programming Language
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                              <option>JavaScript</option>
                              <option>Python</option>
                              <option>HTML</option>
                              <option>CSS</option>
                              <option>Java</option>
                              <option>C++</option>
                              <option>PHP</option>
                              <option>SQL</option>
                              <option>JSON</option>
                              <option>Plain Text</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Code Content
                            </label>
                            <textarea 
                              placeholder="Enter your code here..."
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm bg-gray-50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Code Title (Optional)
                            </label>
                            <input 
                              type="text" 
                              placeholder="e.g., Example Function"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="showLineNumbers" defaultChecked />
                              <label htmlFor="showLineNumbers" className="text-sm text-gray-700">
                                Show line numbers
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="enableCopyButton" defaultChecked />
                              <label htmlFor="enableCopyButton" className="text-sm text-gray-700">
                                Enable copy button
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'embed-content' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Embed Type
                            </label>
                            <select 
                              value={selectedBlock.settings?.embedType || 'custom'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { embedType: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="custom">Custom HTML/iframe</option>
                              <option value="youtube">YouTube Video</option>
                              <option value="vimeo">Vimeo Video</option>
                              <option value="maps">Google Maps</option>
                              <option value="twitter">Twitter Tweet</option>
                              <option value="instagram">Instagram Post</option>
                              <option value="codepen">CodePen</option>
                              <option value="figma">Figma Design</option>
                              <option value="calendly">Calendly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Embed Code/URL
                            </label>
                            <textarea 
                              value={selectedBlock.settings?.embedCode || ''}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { embedCode: e.target.value })}
                              placeholder="Paste your embed code or URL here..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                            />
                            {selectedBlock.settings?.embedCode && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <span className="text-green-700">✓ Embed code detected</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Embed Dimensions
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-gray-600">Width</label>
                                <input 
                                  type="text" 
                                  value={selectedBlock.settings?.width || '100%'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { width: e.target.value })}
                                  placeholder="100%"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Height</label>
                                <input 
                                  type="text" 
                                  value={selectedBlock.settings?.height || '400px'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { height: e.target.value })}
                                  placeholder="400px"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id="responsiveEmbed" 
                              checked={selectedBlock.settings?.responsive !== false}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { responsive: e.target.checked })}
                            />
                            <label htmlFor="responsiveEmbed" className="text-sm text-gray-700">
                              Make responsive
                            </label>
                          </div>
                        </>
                      )}

                      {selectedBlock.type === 'file-download' && (
                        <>
                          {/* Downloadable Files */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Downloadable Files
                            </label>
                            
                            {/* File List */}
                            <div className="space-y-3 mb-4">
                              {(selectedBlock.settings?.files || []).map((file: any, index: number) => (
                                <div key={file.id || index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                                  {/* File Upload */}
                                  <div className="mb-3">
                                    <input
                                      type="file"
                                      id={`file-upload-${index}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        const uploadedFile = e.target.files?.[0];
                                        if (uploadedFile) {
                                          const files = [...(selectedBlock.settings?.files || [])];
                                          files[index] = {
                                            ...files[index],
                                            name: uploadedFile.name,
                                            displayName: files[index]?.displayName || uploadedFile.name.replace(/\.[^/.]+$/, ""),
                                            size: `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`,
                                            type: uploadedFile.name.split('.').pop()?.toLowerCase() || 'file',
                                            url: URL.createObjectURL(uploadedFile),
                                            uploadDate: new Date().toISOString()
                                          };
                                          updateBlockSettings(selectedBlock.id, { files });
                                        }
                                      }}
                                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                                    />
                                    <label
                                      htmlFor={`file-upload-${index}`}
                                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-100 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                        <line x1="12" y1="18" x2="12" y2="12"/>
                                        <polyline points="9,15 12,12 15,15"/>
                                      </svg>
                                      {file.name ? `Replace: ${file.name}` : 'Upload File'}
                                    </label>
                                  </div>

                                  {/* File Details */}
                                  <div className="space-y-2">
                                    <input 
                                      type="text" 
                                      value={file.displayName || ''}
                                      onChange={(e) => {
                                        const files = [...(selectedBlock.settings?.files || [])];
                                        files[index] = { ...files[index], displayName: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { files });
                                      }}
                                      placeholder="File display name"
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                    <textarea 
                                      value={file.description || ''}
                                      onChange={(e) => {
                                        const files = [...(selectedBlock.settings?.files || [])];
                                        files[index] = { ...files[index], description: e.target.value };
                                        updateBlockSettings(selectedBlock.id, { files });
                                      }}
                                      placeholder="File description (optional)"
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                  </div>

                                  {/* File Info & Remove */}
                                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">
                                      {file.type && <span className="uppercase font-medium">{file.type}</span>}
                                      {file.size && <span className="ml-2">{file.size}</span>}
                                    </div>
                                    <button
                                      onClick={() => {
                                        const files = selectedBlock.settings?.files?.filter((_: any, i: number) => i !== index) || [];
                                        updateBlockSettings(selectedBlock.id, { files });
                                      }}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add Another File */}
                            <button 
                              onClick={() => {
                                const files = [...(selectedBlock.settings?.files || [])];
                                files.push({
                                  id: `file-${Date.now()}`,
                                  name: '',
                                  displayName: '',
                                  description: '',
                                  size: '',
                                  type: '',
                                  url: '',
                                  uploadDate: new Date().toISOString()
                                });
                                updateBlockSettings(selectedBlock.id, { files });
                              }}
                              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                              + Add Another File
                            </button>
                          </div>

                          {/* Button Style */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Download Button Style
                            </label>
                            <select 
                              value={selectedBlock.settings?.buttonStyle || 'button'}
                              onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonStyle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="button">Button</option>
                              <option value="link">Link</option>
                              <option value="card">Card</option>
                            </select>
                          </div>

                          {/* Button Colors */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Colors
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Button Color</label>
                                <input
                                  type="color"
                                  value={selectedBlock.settings?.buttonColor || '#3b82f6'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonColor: e.target.value })}
                                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                                <input
                                  type="color"
                                  value={selectedBlock.settings?.buttonTextColor || '#ffffff'}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { buttonTextColor: e.target.value })}
                                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Display Options */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Display Options
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="showFileSize" 
                                  checked={selectedBlock.settings?.showFileSize !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { showFileSize: e.target.checked })}
                                />
                                <label htmlFor="showFileSize" className="text-sm text-gray-700">
                                  Show file size
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="showFileType" 
                                  checked={selectedBlock.settings?.showFileType !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { showFileType: e.target.checked })}
                                />
                                <label htmlFor="showFileType" className="text-sm text-gray-700">
                                  Show file type
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="showDescription" 
                                  checked={selectedBlock.settings?.showDescription !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { showDescription: e.target.checked })}
                                />
                                <label htmlFor="showDescription" className="text-sm text-gray-700">
                                  Show descriptions
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Analytics & Security */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Analytics & Security
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="trackDownloads" 
                                  checked={selectedBlock.settings?.trackDownloads !== false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { trackDownloads: e.target.checked })}
                                />
                                <label htmlFor="trackDownloads" className="text-sm text-gray-700">
                                  Track download analytics
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id="requireLogin" 
                                  checked={selectedBlock.settings?.requireLogin || false}
                                  onChange={(e) => updateBlockSettings(selectedBlock.id, { requireLogin: e.target.checked })}
                                />
                                <label htmlFor="requireLogin" className="text-sm text-gray-700">
                                  Require login to download
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Content Block Library */
                  <div>
                    {contentBlockLibrary.map((category) => {
                      const isCollapsed = collapsedCategories[category.category];
                      return (
                        <div key={category.category} className="mb-4">
                          <button
                            onClick={() => toggleCategoryCollapse(category.category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {category.category === 'Text & Images' ? '🖼️' :
                                 category.category === 'Interactive' ? '⚡' :
                                 category.category === 'Layout' ? '🏗️' :
                                 category.category === 'Document' ? '📄' :
                                 category.category === 'Video' ? '🎥' :
                                 category.category === 'Audio' ? '🎵' :
                                 category.category === 'Advanced' ? '🔧' : '📝'} {category.category}
                              </span>
                            </div>
                            <svg 
                              className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {!isCollapsed && (
                            <div className="mt-3 pl-3">
                              {category.blocks.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {category.blocks.map((block) => (
                                    <button
                                      key={block.id}
                                      onClick={() => handleAddContentBlock(block.id)}
                                      className="p-3 text-xs text-center border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                    >
                                      {block.name}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 italic">
                                  No blocks available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Content Block</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this content block? All content and settings will be permanently removed.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmation({ show: false, blockId: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.blockId) {
                    handleDeleteBlock(deleteConfirmation.blockId);
                    setDeleteConfirmation({ show: false, blockId: null });
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
