import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  universityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'University', required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  degreeType: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String
   },
  requirements: [String]
}, 
{ timestamps: true });

export default mongoose.model('Program', programSchema);