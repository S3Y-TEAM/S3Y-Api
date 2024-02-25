import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const emailOtpController = async(req,res)=>{
  try{
    let token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    const clientToken = req.headers.authorization.split(' ')[1] ;
    let {role} = req.headers ;
    role = roleSelection(role) ;
    const email = decodedToken.email ;
    
    if(clientToken===token){
      let codeNumber = await generateCode(5);
      await sendEmail(email,codeNumber) ;
      const payload = {
          email :  email , 
          role ,
          userName : decodedToken.userName ,
          RandomNumberForSecurity : Math.floor(Math.random() * 1e9) + 1
      }
      token =  attachCookiesToResponse(res,payload) ;
      res.setHeader('Authorization', `Bearer ${token}`)
      res.status(200).json(responseBody("success" , "verification code sent successfully" , 200 , {codeNumber})) ;
    }else {
      throw new Error("You are not allowed to access this page")
    }
  }catch(e){
    res.status(400).json(responseBody("failed" , e.message , 400 , null)) 
  }
}



export {
  emailOtpController 
} ;