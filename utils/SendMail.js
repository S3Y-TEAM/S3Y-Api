
import nodemailer from 'nodemailer'
const sendEmail = async(email ,codeNumber)=>{
    const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "amrk25112001@gmail.com",
      pass: process.env.App_Password
    },
  });
  
  const mailOptions = {
    from: "S3Y-Team",
    to: `${email}`,
    subject: "Email Verification",
    text: `Your Code is : ${codeNumber} \n Don't Share it with anyone  `,
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