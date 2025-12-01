const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  type: {
    type: String,
    required: [true, 'Block type is required'],
    enum: [
      'section',
      'text', 
      'heading',
      'image',
      'image_text',
      'video',
      'accordion',
      'tabs',
      'flip_card',
      'quiz',
      'assignment',
      'link',
      'checklist',
      'certificate',
      'html',
      'pdf'
    ]
  },
  title: {
    type: String,
    required: [true, 'Block title is required'],
    trim: true,
    maxlength: [200, 'Block title cannot be more than 200 characters']
  },
  order: {
    type: Number,
    required: [true, 'Block order is required'],
    min: [0, 'Block order cannot be negative']
  },
  content: {
    // Text block
    text: String,
    html: String,
    
    // Image block
    imageUrl: String,
    imageAlt: String,
    imageCaption: String,
    imageLink: String,
    
    // Video block
    videoUrl: String,
    videoType: { type: String, enum: ['youtube', 'vimeo', 'upload', 'url'] },
    videoTitle: String,
    videoDescription: String,
    autoplay: { type: Boolean, default: false },
    
    // Image + Text block
    layout: { type: String, enum: ['image_left', 'image_right'], default: 'image_left' },
    
    // Accordion block
    items: [{
      title: String,
      content: String,
      isOpen: { type: Boolean, default: false }
    }],
    allowMultipleOpen: { type: Boolean, default: false },
    
    // Tabs block
    tabs: [{
      label: String,
      content: String,
      isActive: { type: Boolean, default: false }
    }],
    
    // Flip Card block
    flipDirection: { type: String, enum: ['horizontal', 'vertical'], default: 'horizontal' },
    frontSide: {
      title: String,
      content: String,
      backgroundColor: { type: String, default: '#3b82f6' }
    },
    backSide: {
      title: String,
      content: String,
      backgroundColor: { type: String, default: '#10b981' }
    },
    
    // Quiz block
    questions: [{
      question: String,
      type: { type: String, enum: ['multiple_choice', 'true_false', 'short_answer'] },
      options: [String],
      correctAnswer: String,
      explanation: String,
      points: { type: Number, default: 1 }
    }],
    passingScore: { type: Number, default: 70 },
    
    // Assignment block
    instructions: String,
    submissionType: { type: String, enum: ['file', 'text', 'url'] },
    maxFileSize: { type: Number, default: 10 }, // MB
    allowedFileTypes: [String],
    dueDate: Date,
    
    // Link block
    url: String,
    linkText: String,
    openInNewTab: { type: Boolean, default: true },
    
    // Checklist block
    checklistItems: [{
      text: String,
      isCompleted: { type: Boolean, default: false },
      isRequired: { type: Boolean, default: false }
    }],
    
    // Certificate block
    certificateTemplate: String,
    certificateTitle: String,
    
    // PDF block
    pdfUrl: String,
    pdfTitle: String,
    allowDownload: { type: Boolean, default: true }
  },
  style: {
    backgroundColor: String,
    textColor: String,
    fontSize: String,
    fontFamily: String,
    padding: String,
    margin: String,
    borderRadius: String,
    border: String,
    customCSS: String
  },
  animation: {
    type: { type: String, enum: ['none', 'fade', 'slide', 'zoom'], default: 'none' },
    duration: { type: Number, default: 300 },
    delay: { type: Number, default: 0 }
  },
  settings: {
    isRequired: { type: Boolean, default: false },
    timeLimit: Number, // in seconds
    attempts: Number,
    showInNavigation: { type: Boolean, default: true }
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
blockSchema.index({ courseId: 1, order: 1 });
blockSchema.index({ type: 1 });
blockSchema.index({ courseId: 1, isActive: 1 });

// Virtual for content summary
blockSchema.virtual('contentSummary').get(function() {
  switch(this.type) {
    case 'text':
      return this.content.text ? this.content.text.substring(0, 100) + '...' : '';
    case 'image':
      return this.content.imageAlt || 'Image block';
    case 'video':
      return this.content.videoTitle || 'Video block';
    case 'quiz':
      return `Quiz with ${this.content.questions?.length || 0} questions`;
    case 'accordion':
      return `Accordion with ${this.content.items?.length || 0} items`;
    case 'tabs':
      return `Tabs with ${this.content.tabs?.length || 0} tabs`;
    default:
      return `${this.type} block`;
  }
});

// Pre-save middleware to ensure order is unique within course
blockSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('order')) {
    const existingBlock = await this.constructor.findOne({
      courseId: this.courseId,
      order: this.order,
      _id: { $ne: this._id }
    });
    
    if (existingBlock) {
      // Shift other blocks down
      await this.constructor.updateMany(
        { 
          courseId: this.courseId, 
          order: { $gte: this.order },
          _id: { $ne: this._id }
        },
        { $inc: { order: 1 } }
      );
    }
  }
  next();
});

// Static method to get blocks by course
blockSchema.statics.findByCourse = function(courseId) {
  return this.find({ courseId, isActive: true }).sort({ order: 1 });
};

// Static method to reorder blocks
blockSchema.statics.reorderBlocks = async function(courseId, blockOrders) {
  const bulkOps = blockOrders.map(({ blockId, order }) => ({
    updateOne: {
      filter: { _id: blockId, courseId },
      update: { order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Block', blockSchema);
