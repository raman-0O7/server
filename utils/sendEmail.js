
import { createTransport } from "nodemailer";

export default async function sendEmail(email, sub, msg) {
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // `true` for port 465, `false` for all other ports
    auth: {
      user: "emile.nitzsche@ethereal.email",
      pass: "yKh2T6GeWnEd9zYqch",
    },
  });
  const info = await transporter.sendMail({
    from: '"Raman kumar" <emile.nitzsche@ethereal.email>',
    to: email,
    subject: sub,
    text: msg,
  });
  console.log("Message sent ", info.messageId);
  return info;
}