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

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7B3F00; font-size: 28px; margin: 0; font-family: 'Playfair Display', Georgia, serif;">Bites</h1>
      </div>

      <div style="background-color: #F8F5F2; border-radius: 16px; padding: 32px; text-align: center;">
        <h2 style="color: #2B2B2B; font-size: 22px; margin-bottom: 16px; font-family: 'Playfair Display', Georgia, serif;">
          Reservation Confirmed!
        </h2>
        <p style="color: #2B2B2B; font-size: 16px; line-height: 1.6;">
          Hi ${username}, we're looking forward to hosting you.
        </p>

        <table style="width: 100%; margin-top: 24px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #7B3F00; text-align: left;">Date</td>
            <td style="padding: 10px 0; color: #2B2B2B; text-align: right; font-weight: bold;">${formattedDate}</td>
          </tr>
          <tr style="border-top: 1px solid #CBA135;">
            <td style="padding: 10px 0; color: #7B3F00; text-align: left;">Time</td>
            <td style="padding: 10px 0; color: #2B2B2B; text-align: right; font-weight: bold;">${time}</td>
          </tr>
          <tr style="border-top: 1px solid #CBA135;">
            <td style="padding: 10px 0; color: #7B3F00; text-align: left;">Guests</td>
            <td style="padding: 10px 0; color: #2B2B2B; text-align: right; font-weight: bold;">${guests}</td>
          </tr>
        </table>
      </div>

      <p style="text-align: center; color: #999; font-size: 13px; margin-top: 30px;">
        If you need to change or cancel your reservation, please contact us directly.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Bites" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reservation Confirmed - Bites",
    text: `Hi ${username}, your reservation for ${guests} guest(s) on ${formattedDate} at ${time} is confirmed. See you soon!`,
    html,
  });
};
