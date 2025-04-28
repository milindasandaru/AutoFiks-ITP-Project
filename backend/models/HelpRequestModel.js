import mongoose from 'mongoose';

const HelpRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'hr', 'operations', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  responses: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
});

// Update timestamps before save
HelpRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  next();
});

const HelpRequest = mongoose.model('HelpRequest', HelpRequestSchema);

export default HelpRequest;

