import express from 'express';
import University from '../models/University.js';
import Program from '../models/Program.js';

const router = express.Router();

// Seed data function
const seedData = async () => {
  try {
    const universityCount = await University.countDocuments();
    if (universityCount === 0) {
      const universities = await University.insertMany([
        { name: "University of Melbourne", country: "Australia", ranking: "#33 Global" },
        { name: "Australian National University", country: "Australia", ranking: "#27 Global" },
        { name: "University of Sydney", country: "Australia", ranking: "#42 Global" },
        { name: "Monash University", country: "Australia", ranking: "#57 Global" },
        { name: "University of Queensland", country: "Australia", ranking: "#50 Global" }
      ]);
      
      await Program.insertMany([
        { universityId: universities[0]._id, name: "Master of Data Science", degreeType: "Masters", duration: "2 years" },
        { universityId: universities[1]._id, name: "Master of Computing", degreeType: "Masters", duration: "2 years" },
        { universityId: universities[2]._id, name: "Master of Information Technology", degreeType: "Masters", duration: "2 years" },
        { universityId: universities[3]._id, name: "Master of Applied Data Science", degreeType: "Masters", duration: "1.5-2 years" },
        { universityId: universities[4]._id, name: "Master of Computer Science", degreeType: "Masters", duration: "2 years" }
      ]);
    }
  } catch (error) {
    console.error('Seed data error:', error);
  }
};

// Call seed function
seedData();

// GET /api/search/universities?q=
router.get('/universities', async (req, res) => {
  try {
    const { q } = req.query;
    
    let universities;
    if (q) {
      universities = await University.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { country: { $regex: q, $options: 'i' } }
        ]
      });
    } else {
      universities = await University.find();
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: universities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Server error'
    });
  }
});

// GET /api/search/programs?q=
router.get('/programs', async (req, res) => {
  try {
    const { q } = req.query;
    
    let programs;
    if (q) {
      programs = await Program.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { degreeType: { $regex: q, $options: 'i' } }
        ]
      }).populate('universityId', 'name country ranking');
    } else {
      programs = await Program.find().populate('universityId', 'name country ranking');
    }

    // Transform data to match frontend expectations
    const transformedPrograms = programs.map(program => ({
      id: program._id,
      name: program.name,
      degreeType: program.degreeType,
      duration: program.duration,
      university: program.universityId.name,
      country: program.universityId.country,
      ranking: program.universityId.ranking
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: transformedPrograms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Server error'
    });
  }
});

export default router;