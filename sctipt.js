// Set environment variables
process.env.EMAIL_USERNAME = 'youremail@gmail';
process.env.EMAIL_PASSWORD = 'two factor auythcation genrated by google';
process.env.EMAIL_HOST = 'smtp.gmail.com';
process.env.EMAIL_PORT = 993;
process.env.EMAIL_USE_TLS = 'true';
process.env.EMAIL_USE_SSL = 'true';
process.env.TWILIO_ACCOUNT_SID = 'twilio sid';
process.env.TWILIO_AUTH_TOKEN = 'twilio auth';
process.env.TWILIO_PHONE_NUMBER = '+twolio number';
process.env.MY_PHONE_NUMBER = '+your number';

// Require the necessary modules
const twilio = require('twilio');
const MailListener = require('mail-listener2');

// Initialize Twilio client with your account SID and auth token
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Create a mail listener that will listen for new emails and trigger a Twilio SMS when one arrives
const mailListener = new MailListener({
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  tls: process.env.EMAIL_USE_TLS,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: ["UNSEEN", ["FROM", "the email you want to listen to"]],
  markSeen: true,
  fetchUnreadOnStart: true,
});

// Start listening for new emails
mailListener.start();

// When a new email arrives, send an SMS notification using Twilio
mailListener.on('mail', (mail, seqno, attributes) => {
  const message = `New email received from ${mail.from[0].address}: ${mail.subject}\n\n${mail.text}`;
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.MY_PHONE_NUMBER
    })
    .then((message) => console.log(`SMS notification sent with SID: ${message.sid}`))
    .catch((err) => console.error('Error sending SMS notification:', err));
});

// Log any errors that occur with the mail listener
mailListener.on('error', (err) => {
  console.error('Mail listener error:', err);
});
