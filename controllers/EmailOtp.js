import prisma from "../db/prisma.js";
import nodemailer from 'nodemailer'
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
const emailOtpController = async(req,res)=>{

    const token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    if(decodedToken.email===req.body.email && req.body.role===decodedToken.role && decodedToken.userName===req.body.userName){
      const {email,role} = req.body ;
      let codeNumber = await generateCode(5);
      await sendEmail(email,codeNumber) ;
      const payload = {
          email :  email , 
          role ,
          userName : decodedToken.userName
      }
      const token =  attachCookiesToResponse(res,payload) ;

      res.status(200).json({codeNumber : codeNumber }) ;
    }else {
      res.status(400).json({error : "You are not allowed to access this page"})
    }
}



export {emailOtpController} ;