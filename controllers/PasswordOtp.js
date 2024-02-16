import { isTokenValid } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { isSameEmail } from "./EmailOtp.js";
import { isSameRole } from "./EmailOtp.js";
const passwordOtpController = async(req,res)=>{
    try{
        const {email} = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({token}) ;
        if(isSameEmail(email , decodedToken.email) && isSameRole(role , decodedToken.role)){
            const codeNumber = await generateCode(5) ;
            const emailSent = await sendEmail(email , codeNumber) ;
            const payload = {
                email :  email ,
                role , 
            }
            const token =  attachCookiesToResponse(res,payload) ;
            res.status(200).json({codeNumber})
        }else {
            throw new Error("you are not allowed to access this route") ;
        }
    }catch(e){
        res.status(400).json({error : e.message})
    }

    
}
export {
    passwordOtpController
}