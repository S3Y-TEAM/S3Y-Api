import  prisma  from "../db/prisma.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const userNameController = async(req,res)=>{
    try{
        const {role , userName} = req.body ;
        
        if(role === "employee" || role === "Employer"){
            const userNameExist = await checkUserNameExistance(role , userName) ;
            if(userNameExist){
                throw new Error("user name exist ")
            }else {
                const payload = {
                    userName : userName , 
                    role
                }
                const token =  attachCookiesToResponse(res,payload) ;
                res.status(201).json({
                    valid :1 ,
                })
            }
        }
        else {
            throw new Error("enter valid role") ;
        }
    }catch(e){
        res.status(400).json({
            error : e.message 
        })
    }
}

const checkUserNameExistance = async(role , userName)=>{
    userName = userName.toLowerCase() ;
    const userNameExist = await prisma[`${role}`].findUnique({
        where : {
            user_name : userName
        }
    })
    return (userNameExist!=null) ;
}

export {
    userNameController , 
    checkUserNameExistance
}