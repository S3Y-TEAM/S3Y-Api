import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { checkEmailExistance } from "./Email.js";
import { responseBody } from "../utils/ResponseBody.js";
import {generateCode} from  '../utils/GenerateCdoe.js'
import {sendEmail} from '../utils/SendMail.js'
const forgetPasswordController = async(req,res)=>{
    try{
        const {email} = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        const user = await checkEmailExistance(role , email) ;
        
        if(user){
            const payload = {
                email :  email ,
                role , 
            }
            const token =  attachCookiesToResponse(res,payload) ;
            res.setHeader('Authorization', `Bearer ${token}`) ;

            const codeNumber = await generateCode(5) ;
            const messageBody = `Dear ${email.split('@')[0]},\nYour verification code for password reset is: ${codeNumber}.\nPlease enter this code on the verification page\nto complete the process.\nThank you,\nS3y Team`
            await sendEmail(email , messageBody) ;
            res.status(200).json(responseBody("success" , "valid email" , 200 , {codeNumber}))
        }else {
            throw new Error('this mail does not exist') ;
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
    }
}
export {
    forgetPasswordController
}