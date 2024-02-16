import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
const emailController = async(req,res)=>{
    try{
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        let {role} = req.headers ;
        role = roleSelection(role) ;
        if(decodedToken.userName === req.body.userName && role===decodedToken.role){
            const {email} = req.body ;
            if(isValidRole(role)){
                const emailExist = await checkEmailExistance(role , email) ;
                if(emailExist){
                    throw new Error("this email already exist...") ;
                }else {
                    const payload = {
                        email :  email ,
                        role , 
                        userName : decodedToken.userName
                    }
                    const token =  attachCookiesToResponse(res,payload) ;
                    
                    res.status(200).json({
                        valid :1 ,
                    })
                }
            }
            else {
                throw new Error("Enter Valid role !!!!!!")
            }
        }
    }catch(e){
        res.status(400).json({
            error : e.message
        })
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

const isValidRole = (role)=>{
    return (role === "employee" || role === "Employer") ;
}
export {
    emailController , 
    checkEmailExistance
}