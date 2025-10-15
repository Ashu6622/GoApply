import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, country, message } = req.body;

    if (!name || !email || !message) {
      return res.json({ success: false, statusCode: 400,message: 'Name, email, and message are required' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      country,
      message
    });
    
    await contact.save();
    
    console.log('Contact form saved:', contact._id);

    res.json({success: true,statusCode: 200,message: 'Thank you for your message. We will get back to you within 24 hours.'
    });
  } 
  catch (error) {
    res.status(500).json({success: false,statusCode: 500,message: 'Server error'});
  }
});

export default router;