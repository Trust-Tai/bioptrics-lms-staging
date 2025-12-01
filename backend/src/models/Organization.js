const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [200, 'Organization name cannot be more than 200 characters']
  },
  seatsTotal: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1']
  },
  seatsUsed: {
    type: Number,
    default: 0,
    min: [0, 'Used seats cannot be negative']
  },
  utilizationRate: {
    type: Number,
    default: 0,
    min: [0, 'Utilization rate cannot be negative'],
    max: [100, 'Utilization rate cannot exceed 100%']
  },
  overdueRate: {
    type: Number,
    default: 0,
    min: [0, 'Overdue rate cannot be negative'],
    max: [100, 'Overdue rate cannot exceed 100%']
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  riskType: {
    type: String,
    trim: true
  },
  contractExpiry: {
    type: Date,
    required: [true, 'Contract expiry date is required']
  },
  contactPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Contact person is required']
  },
  settings: {
    branding: {
      logo: String,
      primaryColor: { type: String, default: '#5a8596' },
      secondaryColor: { type: String, default: '#ffffff' }
    },
    features: {
      certificates: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      customBranding: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic'
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'expired'],
      default: 'active'
    },
    renewalDate: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
organizationSchema.index({ name: 1 });
organizationSchema.index({ riskLevel: 1 });
organizationSchema.index({ contractExpiry: 1 });
organizationSchema.index({ 'subscription.status': 1 });

// Virtual for seats usage percentage
organizationSchema.virtual('seatsUsagePercentage').get(function() {
  return this.seatsTotal > 0 ? Math.round((this.seatsUsed / this.seatsTotal) * 100) : 0;
});

// Virtual for contract status
organizationSchema.virtual('contractStatus').get(function() {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((this.contractExpiry - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring_soon';
  return 'active';
});

// Update utilization rate before saving
organizationSchema.pre('save', function(next) {
  if (this.seatsTotal > 0) {
    this.utilizationRate = Math.round((this.seatsUsed / this.seatsTotal) * 100);
  }
  next();
});

// Static method to find organizations at risk
organizationSchema.statics.findAtRisk = function() {
  return this.find({
    $or: [
      { riskLevel: { $in: ['medium', 'high'] } },
      { utilizationRate: { $lt: 30 } },
      { overdueRate: { $gt: 20 } },
      { contractExpiry: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
    ],
    isActive: true
  }).populate('contactPerson', 'name email avatar');
};

module.exports = mongoose.model('Organization', organizationSchema);
