import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeCode: { 
    type: String, 
    unique: true,      // Unique if set, but optional
    trim: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  designation: String,
  dateOfJoining: Date,
  levelId: String,
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true 
  },
  location: String,
  contactNumber: String,
  department: String,
  isActive: {
    type: Boolean, 
    default: true 
  },
  totalExperience: String,
  txExperience: String,
  visaStatus: String,
  originalDu: String,
  assignedDu: String,
  skills: [{ type: String, trim: true }],
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);