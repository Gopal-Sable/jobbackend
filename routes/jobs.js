const express = require('express');
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const sendEmail = require('../config/email'); // Adjust the path as needed
const logger = require('../utils/logger'); // Adjust the path as needed

const router = express.Router();

// Function to send email template
const sendEmailTemplate = async (recipient, jobData) => {
  const htmlContent = `
    <h2>${jobData.title}</h2>
    <p><strong>Experience Level:</strong> ${jobData.experienceLevel}</p>
    <p><strong>Description:</strong> ${jobData.description}</p>
    <p><strong>Company:</strong> ${jobData.companyName}</p>
    <p><strong>End Date:</strong> ${jobData.endDate}</p>
  `;
  await sendEmail(recipient, `New Job Posting from ${jobData.companyName}`, htmlContent);
};

// POST route for creating a job and sending emails to candidates
router.post('/job', auth, async (req, res) => {
  const { title, description, experienceLevel, candidates, endDate } = req.body;
  const company = req.company; // Company object attached by auth middleware

  // Log the company object to see its contents
  console.log('Company Object:', company);

  // Validate input
  if (!title || !description || !experienceLevel || !endDate || candidates.length === 0) {
    return res.status(400).json({ msg: 'Please fill all fields and add at least one candidate.' });
  }

  try {
    // Create a new job post
    const job = new Job({
      postedBy: company._id, // Reference to the company
      title,
      description,
      experienceLevel,
      candidates,
      endDate
    });
    await job.save();

    // Send emails to all candidates with the company name
    candidates.forEach(async (candidateEmail) => {
      await sendEmailTemplate(candidateEmail, {
        title,
        description,
        experienceLevel,
        companyName: company.companyName, // Access the companyName
        endDate
      });
    });

    res.status(201).json({ msg: 'Job posted and emails sent' });
  } catch (err) {
    console.error('Job posting error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
