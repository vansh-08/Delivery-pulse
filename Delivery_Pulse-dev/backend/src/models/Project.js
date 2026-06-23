import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  accountName: String,
  vertical: String,
  domain: String,
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);