import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
import { responseBody } from "../utils/ResponseBody.js";
const emailController = async(req,res)=>{
    try{
        
        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token);
        let {role} = req.headers ;
        role = roleSelection(role) ;
        
        if(decodedToken){
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
                    token =  attachCookiesToResponse(res,payload) ;
                    res.setHeader('Authorization', `Bearer ${token}`)
                    res.status(200).json(responseBody("success" , "valid email" , 200 , {email})) ;
                }
            }
            else {
                throw new Error("Enter Valid role ")
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

const isValidRole = (role)=>{
    return (role === "employee" || role === "Employer") ;
}
export {
    emailController , 
    checkEmailExistance
}