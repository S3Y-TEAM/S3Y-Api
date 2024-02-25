import { isTokenValid } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const passwordOtpController = async(req,res)=>{
    try{
        const {email} = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        let token = req.signedCookies.token;
        const clientToken = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid({token}) ;
        if(clientToken === token){
            const codeNumber = await generateCode(5) ;
            const emailSent = await sendEmail(email , codeNumber) ;
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