const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [1000, 'Course description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: String,
    default: '30 min'
  },
  thumbnail: {
    type: String,
    default: null
  },
  blocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Course creator is required']
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null // null means it's a global/template course
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateCategory: {
    type: String,
    enum: [
      'Business Ethics',
      'Career Management', 
      'Change Management',
      'Communication',
      'Compliance',
      'Critical Thinking',
      'Customer Service'
    ],
    required: function() { return this.isTemplate; }
  },
  metrics: {
    purchases: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  settings: {
    allowDownload: { type: Boolean, default: false },
    requireCompletion: { type: Boolean, default: true },
    certificateEnabled: { type: Boolean, default: true },
    timeLimit: { type: Number, default: null }, // in minutes
    attempts: { type: Number, default: null } // null = unlimited
  },
  pricing: {
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: null
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ createdBy: 1 });
courseSchema.index({ organizationId: 1 });
courseSchema.index({ isTemplate: 1, templateCategory: 1 });
courseSchema.index({ 'metrics.rating': -1 });
courseSchema.index({ createdAt: -1 });

// Virtual for block count
courseSchema.virtual('blockCount').get(function() {
  return this.blocks ? this.blocks.length : 0;
});

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function() {
  if (this.metrics.enrollments === 0) return 0;
  return Math.round((this.metrics.completions / this.metrics.enrollments) * 100);
});

// Virtual for average rating display
courseSchema.virtual('averageRating').get(function() {
  return this.metrics.ratingCount > 0 ? 
    Math.round(this.metrics.rating * 10) / 10 : 0;
});

// Update lastModified before saving
courseSchema.pre('save', function(next) {
  this.lastModified = new Date();
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Static method to find published courses
courseSchema.statics.findPublished = function(filters = {}) {
  return this.find({ 
    status: 'published', 
    isActive: true,
    ...filters 
  }).populate('createdBy', 'name email')
    .populate('blocks')
    .sort({ createdAt: -1 });
};

// Static method to find templates
courseSchema.statics.findTemplates = function(category = null) {
  const query = { isTemplate: true, isActive: true };
  if (category) query.templateCategory = category;
  
  return this.find(query)
    .populate('createdBy', 'name email')
    .sort({ title: 1 });
};

// Instance method to update metrics
courseSchema.methods.updateMetrics = function(metricType, value = 1) {
  if (this.metrics[metricType] !== undefined) {
    this.metrics[metricType] += value;
    return this.save({ validateBeforeSave: false });
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Course', courseSchema);
