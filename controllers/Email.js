import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const emailController = async(req,res)=>{
    const token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    if(decodedToken.userName === req.body.userName && req.body.role===decodedToken.role){
        const {role , email} = req.body ;
        if(role === "employee" || role === "Employer"){
            const emailExist = await checkEmailExistance(role , email) ;
            if(emailExist){
                res.status(400).json({
                    valid : 0 ,
                    error : 'this email already exist' ,
                })
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
            res.status(400).json({error:'Enter Valid role !!!!!!'}) ;
        }
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

export {
    emailController , 
    checkEmailExistance
}