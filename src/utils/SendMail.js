
import nodemailer from 'nodemailer'
const sendEmail = async(email ,messageBody)=>{
    const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "s3y.team@gmail.com",
      pass: process.env.App_Password
    },
  });
  
  const mailOptions = {
    from: "S3Y-Team",
    to: `${email}`,
    subject: "Verification Email",
    text: messageBody,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}
export {
    sendEmail
}