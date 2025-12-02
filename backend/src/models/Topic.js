const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Topic title is required'],
    trim: true,
    maxlength: [200, 'Topic title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Topic description cannot be more than 500 characters']
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  // Content blocks within this topic
  contentBlocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentBlock'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  // Topic settings
  settings: {
    allowComments: { type: Boolean, default: true },
    requireCompletion: { type: Boolean, default: false },
    showProgress: { type: Boolean, default: true }
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
topicSchema.index({ moduleId: 1, order: 1 });
topicSchema.index({ status: 1 });
topicSchema.index({ createdAt: -1 });

// Virtual for content block count
topicSchema.virtual('contentBlockCount').get(function() {
  return this.contentBlocks ? this.contentBlocks.length : 0;
});

// Pre-save middleware to auto-increment order if not provided
topicSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    try {
      const lastTopic = await this.constructor
        .findOne({ moduleId: this.moduleId })
        .sort({ order: -1 });
      
      this.order = lastTopic ? lastTopic.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to find topics by module
topicSchema.statics.findByModule = function(moduleId, options = {}) {
  const query = { moduleId, isActive: true };
  
  return this.find(query)
    .populate('contentBlocks')
    .sort({ order: 1 })
    .limit(options.limit || 0);
};

// Static method to reorder topics
topicSchema.statics.reorderTopics = async function(moduleId, topicOrders) {
  const bulkOps = topicOrders.map(({ topicId, order }) => ({
    updateOne: {
      filter: { _id: topicId, moduleId },
      update: { order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Topic', topicSchema);
