import express from 'express';
import Application from '../models/Application.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/applications
router.get('/applications', auth, async (req, res) => {
  try {
   
    const applications = await Application.find({ userId: req.user._id });
    
    res.json({
      success: true,
      statusCode: 200,
      applications
    });
  } 
  catch (error) {
    res.json({success: false,statusCode: 500, message: 'Server error'});
  }
});

// POST /api/dashboard/applications
router.post('/applications', auth, async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      userId: req.user._id
    });
    await application.save();

    res.json({success: true, statusCode: 201,application});
  } 
  catch (error) {
    res.json({ success: false,statusCode: 500,message: 'Server error' });
  }
});

// GET /api/dashboard/applications/:id
router.get('/applications/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!application) {
      return res.json({success: false,statusCode: 404, message: 'Application not found'
      });
    }

    res.json({success: true,statusCode: 200,application});
  } 
  catch (error) {
    res.json({success: false,statusCode: 500,message: 'Server error'});
  }
});

// PUT /api/dashboard/applications/:id
router.put('/applications/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Application not found'
      });
    }

    res.json({success: true,statusCode: 200,application});
  }
   catch (error) {res.json({success: false,statusCode: 500,message: 'Server error'});
  }
});

// DELETE /api/dashboard/applications/:id
router.delete('/applications/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Application not found'
      });
    }

    res.json({success: true,statusCode: 200,message: 'Application deleted successfully'});
  } 
  catch (error) {
    res.json({success: false,statusCode: 500,message: 'Server error'});
  }
});

export default router;