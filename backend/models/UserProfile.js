import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { 
  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: String,
  dateOfBirth: Date,
  nationality: String,
  address: String,
  bio: String,
  fieldOfStudy: String,
  studyLevel: { type: String, enum: ['masters', 'bachelors', 'diploma'] },
  englishProficiency: {
    hasTestResults: Boolean,
    examType: { type: String, enum: ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'Other'] },
    examScore: String,
    proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] }
  },

  availableFunds: Number,
  visaRefusalHistory: {
    hasBeenRefused: Boolean,
    details: String
  },

  intendedStartDate: Date,

  education: {
    highestLevel: { type: String, enum: ['graduated', 'studying'] },
    country: String,
    level: { type: String, enum: ['primary', 'secondary', 'undergraduate', 'postgraduate'] },
    grade: String,
    details: String
  },

  standardizedTests: [{ type: String, enum: ['GMAT', 'GRE', 'None'] }]
},
 { timestamps: true });

export default mongoose.model('UserProfile', userProfileSchema);