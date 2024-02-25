import { isTokenValid } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const passwordOtpController = async(req,res)=>{
    try{
        
        let {role} = req.headers ;
        role = roleSelection(role) ;
        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token) ;
        let email = decodedToken.email ;
        if(decodedToken){
            const codeNumber = await generateCode(5) ;
            const messageBody = 
            `
            Dear ${email.split('@')[0]},
            Your verification code for password reset is: ${codeNumber}.\nPlease enter this code on the verification page\nto complete the process.\nThank you,\nS3y Team
            `
            const emailSent = await sendEmail(email , messageBody) ;
            const payload = {
                email :  email ,
                role , 
            }
            token =  attachCookiesToResponse(res,payload) ;
            res.setHeader('Authorization', `Bearer ${token}`)
            res.status(200).json(responseBody("success" , "verification code sent successfully" , 200 , {codeNumber}))
        }else {
            throw new Error("you are not allowed to access this route") ;
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null))
    }

    
}
export {
    passwordOtpController
}