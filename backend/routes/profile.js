import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile/questionnaire
router.get('/questionnaire', auth, async (req, res) => {
  try {
    const existingProfile = await UserProfile.findOne({ userId: req.user._id });

    res.json({success: true,statusCode: 200,currentStep: req.user.registrationStep || 1,existingData:existingProfile || {}});
  } 
  catch (error) {

    res.json({ success: false,statusCode: 500, message: 'Server error' });

  }
});



// POST /api/profile/questionnaire
router.post('/questionnaire', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(req.user._id, {
      profileCompleted: true,
      registrationStep: 8
    });

    res.json({ success: true,statusCode: 200,profile,message: 'Profile updated successfully' });

  }
   catch (error) {
    res.json({  success: false, statusCode: 500, message: 'Server error' });
  }
});

export default router;