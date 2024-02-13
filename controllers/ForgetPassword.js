import prisma from "../db/prisma.js" 
import { attachCookiesToResponse } from "../utils/jwt.js";

const forgetPasswordController = async(req,res)=>{
    try{
        const {email , role} = req.body ;
        const user = await prisma[`${role}`].findUnique({
            where : {
                Email : email
            }
        }) 
        if(user){
            const payload = {
                email :  email ,
                role , 
            }
            const token =  attachCookiesToResponse(res,payload) ;
            res.status(200).json({
                email  , 
            })
        }else {
            throw new Error('this mail does not exist') ;
        }
    }catch(e){
        res.status(400).json({error:e.message}) ;
    }
}
export {
    forgetPasswordController
}