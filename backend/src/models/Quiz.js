const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [200, 'Quiz title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Quiz description cannot be more than 500 characters']
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
  // Quiz questions
  questions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay', 'matching'],
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      id: String,
      text: String,
      isCorrect: { type: Boolean, default: false }
    }],
    correctAnswer: String, // For short-answer and essay questions
    points: {
      type: Number,
      default: 1,
      min: 0
    },
    explanation: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  // Quiz settings
  settings: {
    timeLimit: { type: Number, default: 0 }, // 0 = no time limit, in minutes
    allowRetakes: { type: Boolean, default: true },
    maxAttempts: { type: Number, default: 3 },
    passingScore: { type: Number, default: 70 }, // percentage
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    showCorrectAnswers: { type: Boolean, default: true },
    showScoreImmediately: { type: Boolean, default: true },
    requireCompletion: { type: Boolean, default: false }
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
quizSchema.index({ moduleId: 1, order: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ createdAt: -1 });

// Virtual for question count
quizSchema.virtual('questionCount').get(function() {
  return this.questions ? this.questions.length : 0;
});

// Virtual for total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions ? this.questions.reduce((sum, q) => sum + q.points, 0) : 0;
});

// Pre-save middleware to auto-increment order if not provided
quizSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    try {
      const lastQuiz = await this.constructor
        .findOne({ moduleId: this.moduleId })
        .sort({ order: -1 });
      
      this.order = lastQuiz ? lastQuiz.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to find quizzes by module
quizSchema.statics.findByModule = function(moduleId, options = {}) {
  const query = { moduleId, isActive: true };
  
  return this.find(query)
    .sort({ order: 1 })
    .limit(options.limit || 0);
};

// Instance method to add question
quizSchema.methods.addQuestion = function(questionData) {
  const newOrder = this.questions.length + 1;
  const newQuestion = {
    id: `q-${Date.now()}-${newOrder}`,
    ...questionData,
    order: newOrder
  };
  
  this.questions.push(newQuestion);
  return this.save();
};

// Instance method to remove question
quizSchema.methods.removeQuestion = function(questionId) {
  this.questions = this.questions.filter(q => q.id !== questionId);
  
  // Reorder remaining questions
  this.questions.forEach((q, index) => {
    q.order = index + 1;
  });
  
  return this.save();
};

// Instance method to update question
quizSchema.methods.updateQuestion = function(questionId, updates) {
  const question = this.questions.find(q => q.id === questionId);
  if (question) {
    Object.assign(question, updates);
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Quiz', quizSchema);
