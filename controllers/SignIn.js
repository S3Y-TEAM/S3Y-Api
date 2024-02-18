import prisma from "../db/prisma.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import bcrypt from "bcrypt"
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const signInController = async(req,res)=>{
    try{
        const {email , password}  = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        const user = await getUser(role , email) ;
        if(user && user.Email === email){
            const match = await bcrypt.compare(password, user.Password);
            if(match){
                const payload = {
                    email :  email ,
                    role , 
                }
                const token =  attachCookiesToResponse(res,payload) ;
                res.status(200).json(responseBody("success" , "welcome to s3y" , 200 , {email}))
            }else {
                throw new Error("invalid credentials") ;
            }
        }else {
            throw new Error("invalid credentials")
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null))
    }
}

const getUser = async(role , email)=>{
    const user = await prisma[`${role}`].findUnique({
        where : {
            Email : email 
        }
    })
    return user ;
}
export {
    signInController
}