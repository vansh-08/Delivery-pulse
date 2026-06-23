import mongoose from 'mongoose';

const resourceAssignmentSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  projectManager: String,
  deliveryManager: String,
  billableStatus: String,      // "Billable" / "Non-Billable"
  resourceStatus: String,
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

// Compound index so one employee can't have duplicate assignments on same project
resourceAssignmentSchema.index({ employee: 1, project: 1 }, { unique: true });

export default mongoose.model('ResourceAssignment', resourceAssignmentSchema);