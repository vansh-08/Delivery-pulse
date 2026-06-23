import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  reportDate: {  // The date this report covers (e.g., the previous day)
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Unique index to avoid duplicates for same project + date
reportSchema.index({ project: 1, reportDate: 1, type: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);