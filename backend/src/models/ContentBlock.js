const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content block title is required'],
    trim: true,
    maxlength: [200, 'Content block title cannot be more than 200 characters']
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  // Content category from reference images
  category: {
    type: String,
    enum: ['text-images', 'document', 'video', 'audio'],
    required: true
  },
  // Specific content type within category
  subType: {
    type: String,
    enum: [
      // Text & Images category
      'text-container', 'banner-image', 'content-grid', 'flipboxes', 'accordion',
      // Document category
      'pdf-viewer', 'document-embed', 'downloadable-file',
      // Video category
      'video-player', 'youtube-embed', 'vimeo-embed',
      // Audio category
      'audio-player', 'podcast-embed', 'voice-recording',
      // Special types
      'notice-to-learner', 'quiz-embed', 'interactive-element'
    ],
    required: true
  },
  // Flexible content structure based on subType
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Block-specific settings
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Styling options
  style: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    padding: { type: String, default: '1rem' },
    borderRadius: { type: String, default: '0.5rem' },
    border: { type: String, default: 'none' },
    margin: { type: String, default: '0' },
    customCSS: { type: String, default: '' }
  },
  // Animation settings
  animation: {
    type: { type: String, enum: ['none', 'fade-in', 'slide-in-left', 'slide-in-right', 'scale-in', 'bounce'], default: 'none' },
    duration: { type: Number, default: 0.5, min: 0, max: 5 },
    delay: { type: Number, default: 0, min: 0, max: 10 }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
contentBlockSchema.index({ topicId: 1, order: 1 });
contentBlockSchema.index({ category: 1, subType: 1 });
contentBlockSchema.index({ status: 1 });
contentBlockSchema.index({ createdAt: -1 });

// Virtual for content type display
contentBlockSchema.virtual('displayType').get(function() {
  return `${this.category}/${this.subType}`;
});

// Pre-save middleware to auto-increment order if not provided
contentBlockSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    try {
      const lastBlock = await this.constructor
        .findOne({ topicId: this.topicId })
        .sort({ order: -1 });
      
      this.order = lastBlock ? lastBlock.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  
  // Set default content structure based on subType
  if (this.isNew && (!this.content || Object.keys(this.content).length === 0)) {
    this.content = this.getDefaultContent();
  }
  
  next();
});

// Instance method to get default content structure based on subType
contentBlockSchema.methods.getDefaultContent = function() {
  const defaults = {
    'text-container': {
      heading: '',
      text: '',
      showInstruction: false,
      columns: 1
    },
    'banner-image': {
      imageUrl: '',
      altText: '',
      caption: '',
      link: ''
    },
    'content-grid': {
      columns: 2,
      items: []
    },
    'flipboxes': {
      boxes: []
    },
    'accordion': {
      items: []
    },
    'video-player': {
      videoUrl: '',
      title: '',
      description: '',
      autoplay: false,
      controls: true,
      thumbnail: ''
    },
    'audio-player': {
      audioUrl: '',
      title: '',
      description: '',
      autoplay: false,
      controls: true
    },
    'pdf-viewer': {
      pdfUrl: '',
      title: '',
      allowDownload: true,
      height: '600px'
    },
    'notice-to-learner': {
      message: '',
      type: 'info', // info, warning, success, error
      dismissible: true
    }
  };
  
  return defaults[this.subType] || {};
};

// Static method to find content blocks by topic
contentBlockSchema.statics.findByTopic = function(topicId, options = {}) {
  const query = { topicId, isActive: true };
  
  return this.find(query)
    .sort({ order: 1 })
    .limit(options.limit || 0);
};

// Static method to find content blocks by category
contentBlockSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 0);
};

// Static method to reorder content blocks
contentBlockSchema.statics.reorderBlocks = async function(topicId, blockOrders) {
  const bulkOps = blockOrders.map(({ blockId, order }) => ({
    updateOne: {
      filter: { _id: blockId, topicId },
      update: { order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Instance method to update content
contentBlockSchema.methods.updateContent = function(newContent) {
  this.content = { ...this.content, ...newContent };
  return this.save();
};

// Instance method to update settings
contentBlockSchema.methods.updateSettings = function(newSettings) {
  this.settings = { ...this.settings, ...newSettings };
  return this.save();
};

// Instance method to update style
contentBlockSchema.methods.updateStyle = function(newStyle) {
  this.style = { ...this.style, ...newStyle };
  return this.save();
};

module.exports = mongoose.model('ContentBlock', contentBlockSchema);
