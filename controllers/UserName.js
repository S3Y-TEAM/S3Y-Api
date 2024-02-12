import  prisma  from "../db/prisma.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const userNameController = async(req,res)=>{
    const {role , userName} = req.body ;
    if(role === "employee" || role === "Employer"){
        const userNameExist = await checkUserNameExistance(role , userName) ;
        if(userNameExist){
            res.status(201).json({
                valid : 0 ,
            })
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
        res.status(404).json({
            error : "enter valid role !!" 
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