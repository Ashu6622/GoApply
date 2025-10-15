import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  university: { 
    type: String, 
    required: true 
  },

  program: { 
    type: String, 
    required: true 
  },

  country: { 
    type: String, 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['Draft', 'Submitted', 'Under Review', 'Accepted'],
    default: 'Draft'
  },

  progress: { 
    type: Number, default: 0 
  },

  submittedDate: { 
    type: String 
  },

  deadline: { 
    type: String

   },

  applicationFee: {
     type: String 
    },

  documents: [String],
  
  missingDocuments: [String]
}, 
{ timestamps: true });

export default mongoose.model('Application', applicationSchema);