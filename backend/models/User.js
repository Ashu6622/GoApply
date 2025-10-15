import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true, 
    unique: true 
  },
  passwordHash: { 
    type: String, 
    required: true
  },
  firstName: { 
    type: String
  },
  lastName: {
    type: String 
  },
  profileCompleted: {
    type: Boolean, 
    default: false
  },
  registrationStep: { 
    type: Number, 
    default: 0 
  }
}, 
{ timestamps: true });

export default mongoose.model('User', userSchema);