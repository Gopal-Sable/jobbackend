const express = require('express');  // Import express
const auth = require('../middleware/auth');  // Import auth middleware
const Job = require('../models/Job');  // Import Job model
const sendEmail = require('../config/email');  // Import email config
const logger = require('../utils/logger');  // Import logger utility

const router = express.Router();  // Initialize the router

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

/**
 * @swagger
 * /api/jobs/job:
 *   post:
 *     summary: Create a new job posting and send emails to candidates
 *     description: A company can create a new job post, and job alerts will be sent to the specified candidates.
 *     tags:
 *       - Job Postings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - experienceLevel
 *               - candidates
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               description:
 *                 type: string
 *                 example: "Develop and maintain software applications."
 *               experienceLevel:
 *                 type: string
 *                 example: "2+ years"
 *               candidates:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["candidate1@example.com", "candidate2@example.com"]
 *               endDate:
 *                 type: string
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Job successfully created and emails sent.
 *       400:
 *         description: Validation error (missing fields or invalid data).
 *       500:
 *         description: Server error.
 */


// POST route for creating a job and sending emails to candidates
router.post('/job', auth, async (req, res) => {
  const { title, description, experienceLevel, candidates, endDate } = req.body;
  const company = req.company;

  // Validate input
  if (!title || !description || !experienceLevel || !endDate || candidates.length === 0) {
    return res.status(400).json({ msg: 'Please fill all fields and add at least one candidate.' });
  }

  try {
    // Create a new job post
    const job = new Job({ companyId: company.id, title, description, experienceLevel, candidates, endDate });
    await job.save();

    // Send emails to all candidates
    candidates.forEach(async (candidateEmail) => {
      await sendEmailTemplate(candidateEmail, {
        title,
        description,
        experienceLevel,
        companyName: company.name,
        endDate,
      });
    });

    res.status(201).json({ msg: 'Job posted and emails sent' });
  } catch (err) {
    logger.error('Job posting error:', err);
    console.log('Job posting error:', err);
    
    res.status(500).json({ msg: 'Server error',err:err  });
  }
});

module.exports = router;  // Export the router
