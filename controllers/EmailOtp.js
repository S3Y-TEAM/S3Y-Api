import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { sendEmail } from "../utils/SendMail.js";
import { generateCode } from "../utils/GenerateCdoe.js";
import { roleSelection } from "./UserName.js";
const emailOtpController = async(req,res)=>{
  try{
    const token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    let {role} = req.headers ;
    role = roleSelection(role) ;
    const {email} = req.body ;
    if(isSameEmail(decodedToken.email,req.body.email) && isSameRole(role,decodedToken.role) && isSameUserName(decodedToken.userName,req.body.userName)){
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
      throw new Error("You are not allowed to access this page")
    }
  }catch(e){
    res.status(400).json({
      error : e.message 
    })
  }
}

const isSameEmail = (emailFromToken , emailFromBody)=>{
  return (emailFromToken === emailFromBody) ;
}
const isSameRole = (roleFromToken , roleFromBody)=>{
  return (roleFromToken === roleFromBody) ;
}
const isSameUserName = (userNameFromToken , userNameFromBody)=>{
  return (userNameFromToken === userNameFromBody) ;
}

export {
  emailOtpController ,
  isSameEmail ,
  isSameRole ,
  isSameUserName
} ;