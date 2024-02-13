import { isTokenValid } from "../utils/jwt.js";
import prisma  from "../db/prisma.js";
import bcrypt from  "bcrypt"

const resetPasswordController = async(req,res)=>{
    try{
        const {newPassword , confirmPassword ,email , role} = req.body ;
        let password = newPassword;
        if(newPassword === confirmPassword){
            // hashing password 
            const workFactor = 10;
            await bcrypt
            .genSalt(workFactor)
            .then(salt => {
                return bcrypt.hash(password, salt);
            })
            .then(hash => {
                password = hash ;
            })
            .catch(err => console.error(err.message));

        }else {
            throw new Error("password not match !!") ;
        }

        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        if(decodedToken.email === req.body.email && decodedToken.role===req.body.role){
            const updateUser = await prisma[`${role}`].update({
                where : {
                    Email : email
                },
                data :{
                    Password : password
                }
            })
            // remove cookie
            res.cookie("token", "logout", {
                httpOnly: true,
                expires: new Date(Date.now()),
            });
            res.status(201).json({email});
        }else {
            throw new Error("you are not allowed to access this route!!") 
        }
    }catch(e){
        res.status(400).json({error:e.message}) ;
    }
}
export  {
    resetPasswordController
}