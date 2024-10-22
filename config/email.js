const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  // Create a test account (for development/testing only)
  // let testAccount = await nodemailer.createTestAccount();

  // Create the transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: "yaebxojtmu2ibuht@ethereal.email",
      pass: "Vbfzpw1uHq6mspvpPb",
    },
  });
// console.log(testAccount.user); //just for dev purpose
// console.log(testAccount.pass);


  // Set up the mail options
  const mailOptions = {
    from: "yaebxojtmu2ibuht@ethereal.email", //process.env.EMAIL_USER || testAccount.user, // Use testAccount user if EMAIL_USER is not set
    to: email,
    subject,
    text,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
