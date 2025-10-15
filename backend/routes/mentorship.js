import express from 'express';
import Mentor from '../models/Mentor.js';

const router = express.Router();

// Seed mentors data
const seedMentors = async () => {
  try {
    const mentorCount = await Mentor.countDocuments();
    if (mentorCount === 0) {
      await Mentor.insertMany([
        {
          name: "Dr. Priya Sharma",
          title: "Principal Research Scientist",
          company: "Amazon",
          university: "Carnegie Mellon University",
          degree: "PhD in Machine Learning",
          specialties: ["Deep Learning", "NLP", "Research Publications"],
          rating: 4.9,
          reviews: 156,
          sessions: 98,
          location: "Seattle, WA",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 180,
          availability: "Available",
          nextSlot: "Today, 2:00 PM",
          bio: "Leading AI researcher with 50+ publications. Former PhD admissions reviewer at CMU.",
          isMatched: false,
          isFavorite: true
        },
        {
          name: "James Wilson",
          title: "Investment Banking VP",
          company: "Goldman Sachs",
          university: "Wharton School",
          degree: "MBA in Finance",
          specialties: ["Finance", "MBA Applications", "Career Transition"],
          rating: 4.8,
          reviews: 89,
          sessions: 145,
          location: "New York, NY",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 200,
          availability: "Busy",
          nextSlot: "Tomorrow, 7:00 PM",
          bio: "Former McKinsey consultant turned banker. Expertise in top-tier MBA admissions.",
          isMatched: true,
          isFavorite: false
        },
        {
          name: "Dr. Lisa Chang",
          title: "Biomedical Engineer",
          company: "Johnson & Johnson",
          university: "Johns Hopkins University",
          degree: "PhD in Biomedical Engineering",
          specialties: ["Bioengineering", "Medical School Prep", "Research"],
          rating: 4.7,
          reviews: 134,
          sessions: 87,
          location: "Baltimore, MD",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 140,
          availability: "Available",
          nextSlot: "Today, 4:30 PM",
          bio: "Medical device researcher helping pre-med and engineering students navigate their path.",
          isMatched: false,
          isFavorite: false
        },
        {
          name: "Prof. David Kumar",
          title: "Assistant Professor",
          company: "University of Cambridge",
          university: "Oxford University",
          degree: "DPhil in Economics",
          specialties: ["Economics", "UK Universities", "PhD Applications"],
          rating: 4.9,
          reviews: 78,
          sessions: 112,
          location: "Cambridge, UK",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 160,
          availability: "Available",
          nextSlot: "Tomorrow, 9:00 AM",
          bio: "Oxford alumnus now at Cambridge. Specializes in Oxbridge and European university admissions.",
          isMatched: false,
          isFavorite: true
        },
        {
          name: "Maria Santos",
          title: "UX Design Lead",
          company: "Meta",
          university: "RISD",
          degree: "Master of Fine Arts in Design",
          specialties: ["Design", "Creative Portfolios", "Art School Applications"],
          rating: 4.6,
          reviews: 167,
          sessions: 203,
          location: "Menlo Park, CA",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 120,
          availability: "Available",
          nextSlot: "Today, 6:00 PM",
          bio: "Award-winning designer helping students build compelling creative portfolios.",
          isMatched: false,
          isFavorite: false
        },
        {
          name: "Dr. Ahmed Hassan",
          title: "Startup Founder & CEO",
          company: "TechVenture Inc",
          university: "MIT",
          degree: "PhD in Electrical Engineering",
          specialties: ["Entrepreneurship", "Engineering", "Startup Strategy"],
          rating: 4.8,
          reviews: 92,
          sessions: 76,
          location: "Austin, TX",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 220,
          availability: "Busy",
          nextSlot: "Friday, 3:00 PM",
          bio: "Serial entrepreneur with 2 successful exits. Mentors aspiring founders and engineers.",
          isMatched: true,
          isFavorite: false
        },
        {
          name: "Rachel Thompson",
          title: "Clinical Psychologist",
          company: "Mayo Clinic",
          university: "Harvard University",
          degree: "PhD in Clinical Psychology",
          specialties: ["Psychology", "Medical School", "Mental Health"],
          rating: 4.9,
          reviews: 145,
          sessions: 189,
          location: "Rochester, MN",
          avatar: "/placeholder-user.jpg",
          hourlyRate: 130,
          availability: "Available",
          nextSlot: "Tomorrow, 1:00 PM",
          bio: "Harvard-trained psychologist specializing in helping students with psychology and pre-med paths.",
          isMatched: false,
          isFavorite: false
        }
      ]);
    }
  } catch (error) {
    console.error('Seed mentors error:', error);
  }
};

// Call seed function
seedMentors();

// GET /api/mentorship/mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    
    res.json({success: true,statusCode: 200,data: mentors});
    
  } 
  catch (error) {
    res.json({success: false,statusCode: 500,message: 'Server error'});
  }
});

export default router;