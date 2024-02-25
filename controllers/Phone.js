import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const phoneController = async(req,res)=>{
    try{
        const {phone } = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token);
    
        if(decodedToken){
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
                token =  attachCookiesToResponse(res,payload) ;
                res.setHeader('Authorization', `Bearer ${token}`)
                res.status(200).json(responseBody("success" , "valid phone number" , 200 , {phone}))
            }
        }
        else {
            throw new Error("unAuthorized to access this route .. ") ;
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
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