import express from 'express';

const router = express.Router();

// GET /api/static/fields-of-study
router.get('/fields-of-study', (req, res) => {
  const fieldsOfStudy = [
    'Business & Management',
    'Engineering & Technology',
    'Computer Science & IT',
    'Medicine & Health Sciences',
    'Arts & Humanities',
    'Social Sciences',
    'Natural Sciences',
    'Law',
    'Education',
    'Architecture & Design',
    'Agriculture & Environmental Sciences',
    'Other'
  ];

  res.json({
    success: true,
    statusCode: 200,
    data: fieldsOfStudy
  });
});

// GET /api/static/nationalities
router.get('/nationalities', (req, res) => {
  const nationalities = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Ghana', 'Greece',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Japan', 'Jordan', 'Kenya', 'South Korea', 'Lebanon', 'Malaysia',
    'Mexico', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
    'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia',
    'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sri Lanka',
    'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
    'United States', 'Vietnam', 'Other'
  ];

  res.json({
    success: true,
    statusCode: 200,
    data: nationalities
  });
});

export default router;