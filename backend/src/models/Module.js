const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
    maxlength: [200, 'Module title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Module description cannot be more than 1000 characters']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  // Module duration in minutes
  estimatedMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  // Module goals/description (rich text)
  goals: {
    type: String,
    trim: true,
    maxlength: [2000, 'Module goals cannot be more than 2000 characters']
  },
  // Module-specific learning objectives
  learningObjectives: [{
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Learning objective cannot be more than 500 characters']
    },
    order: {
      type: Number,
      required: true
    }
  }],
  // Topics within this module
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  // Quizzes within this module
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
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
moduleSchema.index({ courseId: 1, order: 1 });
moduleSchema.index({ status: 1 });
moduleSchema.index({ createdAt: -1 });

// Virtual for topic count
moduleSchema.virtual('topicCount').get(function() {
  return this.topics ? this.topics.length : 0;
});

// Virtual for quiz count
moduleSchema.virtual('quizCount').get(function() {
  return this.quizzes ? this.quizzes.length : 0;
});

// Virtual for total content count
moduleSchema.virtual('contentCount').get(function() {
  return this.topicCount + this.quizCount;
});

// Virtual for learning objectives count
moduleSchema.virtual('objectiveCount').get(function() {
  return this.learningObjectives ? this.learningObjectives.length : 0;
});

// Pre-save middleware to auto-increment order if not provided
moduleSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    try {
      const lastModule = await this.constructor
        .findOne({ courseId: this.courseId })
        .sort({ order: -1 });
      
      this.order = lastModule ? lastModule.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to find modules by course
moduleSchema.statics.findByCourse = function(courseId, options = {}) {
  const query = { courseId, isActive: true };
  
  return this.find(query)
    .populate('topics')
    .populate('quizzes')
    .sort({ order: 1 })
    .limit(options.limit || 0);
};

// Static method to reorder modules
moduleSchema.statics.reorderModules = async function(courseId, moduleOrders) {
  const bulkOps = moduleOrders.map(({ moduleId, order }) => ({
    updateOne: {
      filter: { _id: moduleId, courseId },
      update: { order }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Instance method to add learning objective
moduleSchema.methods.addLearningObjective = function(text) {
  const newOrder = this.learningObjectives.length + 1;
  const newObjective = {
    id: `obj-${Date.now()}-${newOrder}`,
    text: text.trim(),
    order: newOrder
  };
  
  this.learningObjectives.push(newObjective);
  return this.save();
};

// Instance method to remove learning objective
moduleSchema.methods.removeLearningObjective = function(objectiveId) {
  this.learningObjectives = this.learningObjectives.filter(
    obj => obj.id !== objectiveId
  );
  
  // Reorder remaining objectives
  this.learningObjectives.forEach((obj, index) => {
    obj.order = index + 1;
  });
  
  return this.save();
};

// Instance method to update learning objective
moduleSchema.methods.updateLearningObjective = function(objectiveId, newText) {
  const objective = this.learningObjectives.find(obj => obj.id === objectiveId);
  if (objective) {
    objective.text = newText.trim();
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Module', moduleSchema);
