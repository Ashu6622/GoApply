import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: { 
    type: String, required: true
   },
  country: { 
    type: String, required: true 
  },
  logoUrl: {
     type: String 
    },
  description: {
     type: String 
    },
  ranking: { 
    type: String
   }
}, 
{ timestamps: true });

export default mongoose.model('University', universitySchema);