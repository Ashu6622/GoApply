import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  university: { 
    type: String, 
    required: true 
  },
  degree: { 
    type: String, 
    required: true 
  },
  specialties: [String],
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: { 
    type: Number, 
    default: 0 
  },
  sessions: { 
    type: Number, 
    default: 0 
  },
  location: String,
  avatar: String,
  hourlyRate: { 
    type: Number, 
    required: true 
  },
  availability: { 
    type: String, 
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available'
  },
  nextSlot: String,
  bio: String,
  isMatched: { 
    type: Boolean, 
    default: false 
  },
  isFavorite: { 
    type: Boolean, 
    default: false 
  }
}, 
{ timestamps: true });

export default mongoose.model('Mentor', mentorSchema);