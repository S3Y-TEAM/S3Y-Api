import prisma from "../db/prisma.js";
import nodemailer from 'nodemailer'
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const emailOtpController = async(req,res)=>{

    const token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    if(decodedToken.email===req.body.email && req.body.role===decodedToken.role && decodedToken.userName===req.body.userName){
      const {email,role} = req.body ;
      let codeNumber = generateCode();

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

        const payload = {
          email :  email , 
          code : codeNumber ,
          role ,
          userName : decodedToken.userName
        }
        const token =  attachCookiesToResponse(res,payload) ;

        res.status(200).json({codeNumber : codeNumber }) ;
    }else {
      res.status(400).json({error : "You are not allowed to access this page"})
    }
}

const generateCode = ()=>{
    let codeNumber  = [];
    let codeSize = 5 ;
    while(codeSize > 0){
        let randomNumber = Math.floor(Math.random()*10);
        codeNumber.push(randomNumber) ;
        codeSize-- ;
    }
    let stringCodeNumber = codeNumber.join('') ;
    return stringCodeNumber ;
}

export {emailOtpController} ;