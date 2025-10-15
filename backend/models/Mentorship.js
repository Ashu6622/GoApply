import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true 
    },

  mentorId: {
     type: String, 
     required: true 
    },

  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },

  scheduledAt: {
     type: Date 
    },
    
  notes: { type: String }

}, 
{ timestamps: true });

export default mongoose.model('Mentorship', mentorshipSchema);