import prisma from "../db/prisma.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import bcrypt from "bcrypt"
const signInController = async(req,res)=>{
    try{
        const {email , password , role}  = req.body ;
        const user = await prisma[`${role}`].findUnique({
            where : {
                Email : email 
            }
        })
        //console.log(user) ;
        let validUser = 0 ;
        if(user && user.Email === email){
            const match = await bcrypt.compare(password, user.Password);
            validUser = match ;
        }
        if(validUser){
            const payload = {
                email :  email ,
                role , 
            }
            const token =  attachCookiesToResponse(res,payload) ;
            res.status(200).json({
                email
            })
        }else {
            throw new Error("invalid credentials")
        }
    }catch(e){
        res.status(400).json({error : e.message})
    }
}
export {
    signInController
}