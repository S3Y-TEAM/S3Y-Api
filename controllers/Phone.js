import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const phoneController = async(req,res)=>{
    try{
        const {role , phone } = req.body ;
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        
        if((decodedToken.userName===req.body.userName)&&(role === "employee" || role === "Employer") && decodedToken.role===req.body.role){
            const phoneExist = await checkPhoneExistance(role , phone) ;
            if(phoneExist){
                res.status(400).json({
                    error : "this phone already exist"
                })
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