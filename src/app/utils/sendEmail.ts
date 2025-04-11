import nodemailer from 'nodemailer';
import config from '../config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface PasswordResetEmailOptions {
  name: string;
  resetLink: string;
  expiryTime: string;
}

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: config.NODE_ENV ==='production',
//   auth: {
//           user: config.nodemailer_email,
//           pass: config.nodemailer_app_pass,
//         },
// });
// const isProd = config.NODE_ENV === 'production';

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: isProd ? 465 : 587,
//   secure: isProd, // true for 465, false for 587
//   auth: {
//     user: config.nodemailer_email,
//     pass: config.nodemailer_app_pass,
//   },
// });
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // always false for port 587
  auth: {
    user: config.nodemailer_email,
    pass: config.nodemailer_app_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


transporter.verify((error) => {
  if (error) {
    console.log('Error with email transporter:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendEmail = async (options: SendEmailOptions) => {
  const mailOptions = {
    from: `"${config.nodemailer_email}" <${config.nodemailer_email}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
   console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.log('Error sending email:', error);
  
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  options: PasswordResetEmailOptions
) => {
  const subject = 'Password Reset Request';
  const html = generatePasswordResetEmailHtml(options);

  await sendEmail({
    to: email,
    subject,
    html,
  });
};

const generatePasswordResetEmailHtml = (options: PasswordResetEmailOptions) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #2563eb;
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello ${options.name},</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <p><a href="${options.resetLink}" class="button">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in ${options.expiryTime}.</p>
        <div class="footer">
          <p>Best regards,</p>
          <p>The Quick Cash Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};