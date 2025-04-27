import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: String,
    licensePlate: String,
    vin: String
  },
  serviceType: {
    type: String,
    enum: ['maintenance', 'repair', 'inspection', 'other'],
    default: 'maintenance'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed', 'on hold'],
    default: 'pending'
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  customerName: {
    type: String,
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: Number, // In minutes
    default: 60
  },
  notes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  }
});

// Update the 'updatedAt' field before saving
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the 'updatedAt' field before update
TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = Date.now();
  next();
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;