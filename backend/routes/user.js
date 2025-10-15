import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get current user data using JWT token
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Get user profile if exists
    const profile = await UserProfile.findOne({ userId: user._id });

    res.json({success: true,
      data: {
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileCompleted: user.profileCompleted,
          registrationStep: user.registrationStep,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        profile: profile || null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

export default router;