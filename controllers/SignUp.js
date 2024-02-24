import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
import bcrypt from "bcrypt" ;
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { isSameUserName ,isSameRole , isSameEmail } from './EmailOtp.js';
import { encryptPasswords } from './ResetPassword.js';
import { responseBody } from '../utils/ResponseBody.js';
const signUpController = async(req,res)=>{
    let {role} = req.headers ;
    role = roleSelection(role) ;
    try{
        //authorization 
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        const {Email , user_name} = req.body ;
        // phone or email because phone page may be skipped
        if(isSameUserName(decodedToken.userName , req.body.user_name) && isSameRole(decodedToken.role , role) && (isSamePhone(decodedToken.phone,req.body.Phone_number)||isSameEmail(decodedToken.email ,req.body.Email))){
            const workFactor = 10;
            let password = req.body.Password;
             
            // hashing password 
            password = await encryptPasswords(password) ;
            req.body.Password = password ;
            const values = req.body ;
            let user = await insertValues(values , role) ;
            delete user.Password ;
            const payload = user ;
            //console.log(payload) ;
            const token = attachCookiesToResponse(res,payload) ;
            res.status(201).json(responseBody("success" , "successfully registered" , 201 , {token})) ;
        }else {
            throw new Error("unAuthorized to access this route !")
        }
    }catch(e){
        //await deleteValue(req.body.Email , role) ;
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
    }
}

const insertValues = async(values , role)=>{
    try{
        if(role === "employee"){
            
                const user = await prisma.employee.create({
                    data: {
                        National_id : values.National_id , 
                        Fname : values.Fname , 
                        Lname : values.Lname ,
                        Email : values.Email , 
                        Password :values.Password ,
                        Phone_number : values.Phone_number ,
                        Personal_image : values.Personal_image ,
                        country : values.country , 
                        city : values.city , 
                        Address : values.Address , 
                        user_name : values.user_name , 
                        verified : 1 , 
                        Links : {
                            create : values.Links 
                        }    , 
                        certficates : {
                            create : values.certficates
                        } ,
                        employee_has_category : {
                            create : values.categories
                        }
                    }
                })
                
                return user ;
        }else if(role==="Employer"){

            const user = await prisma.Employer.create({
                data: {
                    Fname : values.Fname , 
                    Lname : values.Lname ,
                    Email : values.Email , 
                    Password :values.Password ,
                    Phone_number : values.Phone_number ,
                    img : values.Personal_image ,
                    country : values.country , 
                    city : values.city , 
                    Address : values.Address , 
                    user_name : values.user_name , 
                }
            })
            
            return user ;


        }else {
            throw new Error("invalid role ..") 
        }
    }catch(e){
        throw new Error(e.message) ;
    }
}

// const deleteValue = async (Email , role)=>{
//     const userData = await prisma[`${role}`].findUnique({
//         where : {
//             Email : Email
//         }
//     })
//     const user = await prisma[`${role}`].delete({
//         where : {
//             id : userData.id
//         }
//     })
// }

const isSamePhone = (phoneFromToken , phoneFromBody)=>{
    return (phoneFromToken === phoneFromBody) ;
}
export {
    signUpController
}


/**
 * {
     "role" : "employee" ,
     "National_id" : "qwerwrwq215650744445678930" , 
     "Fname" : "7sm2ard2o1o30" , 
     "Lname" : "7a2aa31d0" ,
     "Email" : "amrkhaled6025@gmail.com" , 
     "Password" :"7a565655670" ,
     "Phone_number" : "999924244441150" ,
     "Personal_image" : "0xa2252151510" ,
     "country" : "Egaypt" , 
     "city" : "cairao" , 
     "Address" : "cairo,6octaober0" , 
     "user_name" : "qqqqsswp444aaoa30" ,  
     "Links" : [
        {
            "Linkedin":"http://Linkedin.com" , 
            "Github" : "http://Github.com"
        }
     ]  , 
     "certficates" : [
        {"name" : "ccnaaa"} ,
        {"name" : "lplplp"}
     ] , 
     "categories" : [
        {"category_id" : 2} , 
        {"category_id" : 3}
     ]
    
}
 * 
 * 
 */