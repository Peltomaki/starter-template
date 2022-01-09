const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //host: 'smtp.mailtrap.io',
    //port: 2525,
    // auth: {
    //   user: '0cd80d722f180a',
    //   pass: 'f582226cf39376',
    // },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // 2 Define the email options
  const mailOptions = {
    from: 'Info <info@testi.fi>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
