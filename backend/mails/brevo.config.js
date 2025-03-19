import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const brevoTransporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const sender = {
  email: process.env.BREVO_SMTP_MAIL,
  name: "Autofiks",
};
