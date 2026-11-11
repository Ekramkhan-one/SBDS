// utils/mailer.js
// Optional email sending via SMTP (works with a free Gmail account + App Password).
// If the SMTP_* variables are not set, email is silently skipped and the app
// still works with in-app notifications only.

let transporter = null;

const isEmailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (transporter) return transporter;
  // Required lazily so the server still starts if nodemailer isn't installed yet
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: (parseInt(process.env.SMTP_PORT, 10) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
};

// Returns true if sent, false if skipped or failed. Never throws.
const sendEmail = async ({ to, subject, text }) => {
  if (!isEmailConfigured()) return false;
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error(`Email to ${to} failed:`, error.message);
    return false;
  }
};

module.exports = { sendEmail, isEmailConfigured };
