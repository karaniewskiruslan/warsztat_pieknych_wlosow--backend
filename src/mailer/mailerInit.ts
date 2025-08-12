import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TEST_EMAIL,
    pass: process.env.TEST_EMAIL_PASSWORD,
  },
});
