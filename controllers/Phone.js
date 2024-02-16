import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import {isSameUserName} from './EmailOtp.js'
import {isValidRole} from './UserName.js'
import {isSameRole} from './EmailOtp.js'
const phoneController = async(req,res)=>{
    try{
        const {phone } = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        
        if(isSameUserName(decodedToken.userName,req.body.userName) && isValidRole(role) && isSameRole(decodedToken.role,role)){
            const phoneExist = await checkPhoneExistance(role , phone) ;
            if(phoneExist){
                throw new Error("this phone already exist")
            }else {
                const payload = {
                    email :  decodedToken.email , 
                    phone  ,
                    role , 
                    userName : decodedToken.userName
                }
                const token =  attachCookiesToResponse(res,payload) ;
                res.status(201).json({
                phone   
                })
            }
        }
        else {
            throw new Error("unAuthorized to access this route .. ") ;
        }
    }catch(e){
        res.status(400).json({error : e.message}) ;
    }
}

const checkPhoneExistance = async(role , phone)=>{
    const phoneExist = await prisma[`${role}`].findFirst({
        where : {
            Phone_number : phone
        }
    })
    return (phoneExist!=null) ;
}

export {
    phoneController
}