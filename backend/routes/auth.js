import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false,statusCode: 400,message: 'User already exists'});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, firstName, lastName });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true,statusCode: 201,token,});
  } 
  catch (error) {

    res.json({ success: false,statusCode: 500,message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('_id email passwordHash');
    if (!user) {
      return res.json({ success: false,statusCode: 400,message: 'User Not Present' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.json({ success: false, statusCode: 400, message: 'Incorrect Password'});
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, statusCode: 200, token});
  } 
  catch (error) {
    
    res.json({ success: false, statusCode: 500, message: 'Server error' });

  }
});


// GET /api/auth/profile
// router.get('/profile', auth, async (req, res) => {
//   try {

//      // First check whether the user exists or not
//      console.log(req.user._id);
//     const userExists = await User.findById(req.user._id, {firstname:1});
//     if (!userExists) {
//       console.log(userExists);
//       return res.json({ success: false, statusCode: 404, message: 'User not found' });
//     }

//     const profile = await UserProfile.findOne({ userId: req.user._id }).select('-passwordHash');

//     res.json({ success: true,statusCode: 200, profile});

//   } 
//   catch (error) {
//     res.json({ success: false,statusCode: 500, message: 'Server error' });
//   }
// });


// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, ...profileData } = req.body;

    // First check whether the user exists or not
    const userExists = await User.findById(req.user._id, {firstname:1});
    if (!userExists) {
      console.log(userExists);
      return res.json({ success: false, statusCode: 404, message: 'User not found' });
    }

    if (firstName || lastName) {
      await User.findByIdAndUpdate(req.user._id, { firstName, lastName });
    }

    const profile = await UserProfile.findOneAndUpdate({ userId: req.user._id },profileData,{ new: true, upsert: true });

    res.json({ success: true,statusCode: 200, profile });

  } 
  catch (error) {

    res.json({ success: false, statusCode: 500, message: 'Server error' });

  }
});

// POST /api/auth/complete-profile - Complete registration questionnaire
router.post('/complete-profile', auth, async (req, res) => {
  try {
    const profileData = req.body;

    // Update user as profile completed
    await User.findByIdAndUpdate(req.user._id, { 
      profileCompleted: true, 
      registrationStep: 8 
    });

    // Create or update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...profileData, userId: req.user._id },
      { new: true, upsert: true }
    );

    res.json({ success: true,statusCode: 200,message: 'Profile completed successfully'});

  } 
  catch (error) {
    console.error('Complete profile error:', error);
    res.json({ 
      success: false,
      statusCode: 500,
      message: 'Server error' 
    });
  }
});

// POST /api/auth/save-progress - Save questionnaire progress
router.post('/save-progress', auth, async (req, res) => {
  try {
    const { step, profileData } = req.body;

    // Update user's current step
    await User.findByIdAndUpdate(req.user._id, { registrationStep: step });

    // Save partial profile data
    if (profileData && Object.keys(profileData).length > 0) {
      await UserProfile.findOneAndUpdate(
        { userId: req.user._id },
        { ...profileData, userId: req.user._id },
        { new: true, upsert: true }
      );
    }

    res.json({ 
      success: true,
      statusCode: 200,
      message: 'Progress saved' 
    });

  } catch (error) {
    res.json({ 
      success: false,
      statusCode: 500,
      message: 'Server error' 
    });
  }
});

// // POST /api/auth/logout
// router.post('/logout', auth, (req, res) => {
//   res.status(200).json({ 
//     success: true,
//     statusCode: 200,
//     message: 'Logged out successfully' 
//   });
// });

export default router;