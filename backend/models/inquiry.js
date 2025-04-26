import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  serviceID: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['feedback', 'complaint'],
    default: 'feedback'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['important', 'very important', 'normal'],
    default: 'normal',
    required: function() {
      return this.type === 'complaint';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model("Inquiry", inquirySchema);