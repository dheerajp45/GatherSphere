import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

async function sendEmail(emailBody) {
    const {to,subject,text} = emailBody
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to:to,
      subject:subject,
      text:text
    });

    console.log(info);
  } catch (error) {
    console.log(error);
  }
}

export {sendEmail}