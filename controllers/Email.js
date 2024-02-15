import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const emailController = async(req,res)=>{
    try{
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        if(decodedToken.userName === req.body.userName && req.body.role===decodedToken.role){
            const {role , email} = req.body ;
            if(role === "employee" || role === "Employer"){
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

export {
    emailController , 
    checkEmailExistance
}