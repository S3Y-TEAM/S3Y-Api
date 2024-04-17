import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
import { responseBody } from "../utils/ResponseBody.js";
import {generateCode} from  '../utils/GenerateCdoe.js'
import {sendEmail} from '../utils/SendMail.js'
const emailController = async(req,res)=>{
    
    try{
        
        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token);
        let {role} = req.headers ;
        role = roleSelection(role) ;
        isValidUserName(decodedToken.userName , req.body.userName)
        if(decodedToken){
            const {email} = req.body ;
            const emailExist = await checkEmailExistance(role , email) ;
            if(emailExist){
                throw new Error("this email already exist...") ;
            }else {
                const payload = {
                    email :  email ,
                    role , 
                    userName : decodedToken.userName
                }
                token =  attachCookiesToResponse(res,payload) ;
                res.setHeader('Authorization', `Bearer ${token}`)
                
                let codeNumber = await generateCode(5);
                const messageBody = `Dear ${email.split('@')[0]},\nYour verification code for email verification is: ${codeNumber}.\nPlease enter this code on the verification page\nto complete the process.\nThank you,\nS3y Team`
                await sendEmail(email,messageBody) ;
                res.status(200).json(responseBody("success" , "valid email" , 200 , {codeNumber})) ;
            }
            
        }else {
            throw new Error("unauthorized to access this route")
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
    }
}

const checkEmailExistance = async(role , email)=>{
    const emailExist = await prisma[`${role}`].findUnique({
        where : {
            Email : email
        }
    })
    return (emailExist!=null) ;
}

const isValidUserName = (userNameBody , userNameToken)=>{
    if(userNameBody===userNameToken)return 1;
    else throw new Error('You are not allowed to access this page !!') ;
}
export {
    emailController , 
    checkEmailExistance ,
    isValidUserName
}