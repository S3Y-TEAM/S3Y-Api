import { isTokenValid } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const passwordOtpController = async(req,res)=>{
    try{
        const {email,role} = req.body ;
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({token}) ;
        if(email === decodedToken.email && role===decodedToken.role){
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
        res.status(400).json({error : "something went wrong .."})
    }

    
}
export {
    passwordOtpController
}