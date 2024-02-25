import { isTokenValid } from "../utils/jwt.js";
import prisma  from "../db/prisma.js";
import bcrypt from  "bcrypt"
import { roleSelection } from "./UserName.js";
import { responseBody } from "../utils/ResponseBody.js";
const resetPasswordController = async(req,res)=>{
    try{
        const {newPassword , confirmPassword ,email} = req.body ;
        let {role} = req.headers ;
        role = roleSelection(role) ;
        let password = newPassword;
        if(isSamePassword(newPassword , confirmPassword)){
            password = await encryptPasswords(password , 10) ;
        }else {
            throw new Error("password not match !!") ;
        }

        let token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        const clientToken = req.headers.authorization.split(' ')[1] ;
        if(token === clientToken){
            await updatePassword(role , email , password) ;
            // remove cookie
            res.cookie("token", "logout", {
                httpOnly: true,
                expires: new Date(Date.now()),
            });
            
            res.status(201).json(responseBody("success" , "password updated successfully" , 201 , null));
        }else {
            throw new Error("you are not allowed to access this route!!") 
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
    }
}

const encryptPasswords = async(password , workFactor)=>{
    await bcrypt
        .genSalt(workFactor)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {
            password = hash ;
        })
        .catch(err => console.error(err.message));
    return password  ;
}

const isSamePassword = (newPassword , confirmPassword)=>{
    return (newPassword===confirmPassword) ;
}

const updatePassword = async(role , email , password)=>{
    await prisma[`${role}`].update({
        where : {
            Email : email
        },
        data :{
            Password : password
        }
    })
}



export  {
    resetPasswordController , 
    encryptPasswords , 
    updatePassword
}