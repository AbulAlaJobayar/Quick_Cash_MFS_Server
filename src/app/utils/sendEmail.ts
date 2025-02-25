import config from '../config';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_app_pass,
    },
  });
  await transporter.sendMail({
    from: config.nodemailer_email,
    to,
    subject: 'Reset your password within 10 mins!',
    text: '', // plain text body
    html, // html body
  });
};
