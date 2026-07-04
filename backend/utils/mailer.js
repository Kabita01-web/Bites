import nodemailer from "nodemailer";

export const sendReservationEmail = async (
  to,
  username,
  date,
  time,
  guests,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Bites" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reservation Confirmed - Bites",
    text: `Hi ${username}, your reservation for ${guests} guest(s) on ${date} at ${time} is confirmed. See you soon!`,
  });
};
