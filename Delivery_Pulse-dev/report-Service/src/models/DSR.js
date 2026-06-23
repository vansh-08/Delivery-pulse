import mongoose from 'mongoose';

const dsrSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  dsr_date: {
    type: Date,
    required: true
  },
  tasks_today: [{
    type: String,
    trim: true
  }],
  tasks_tomorrow: [{
    type: String,
    trim: true
  }],
  blockers: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

dsrSchema.index({ employee_id: 1, dsr_date: 1 });
dsrSchema.index({ project_id: 1, dsr_date: 1 });

export default mongoose.model('DSR', dsrSchema);
