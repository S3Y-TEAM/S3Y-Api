import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
import bcrypt from "bcrypt" ;
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
const signUpController = async(req,res)=>{
    try{
        //authorization 
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        // console.log(decodedToken) ;
        
        if((decodedToken.userName===req.body.user_name)&&(decodedToken.role===req.body.role)&&((decodedToken.phone === req.body.Phone_number)||(decodedToken.email===req.body.Email))){
            const workFactor = 10;
            let password = req.body.Password;
            
            // hashing password 
            await bcrypt
            .genSalt(workFactor)
            .then(salt => {
                return bcrypt.hash(password, salt);
            })
            .then(hash => {
                password = hash ;
            })
            .catch(err => console.error(err.message));

            req.body.Password = password ;
            
            const values = req.body ;
            console.log(values) ;
            // create user
            const user = await insertValues(values) ;
            res.status(201).json(user) ;
        }else {
            throw new Error("unAuthorized to access this route !")
        }
    }catch(e){
        res.status(400).json({error : e.message}) ;
    }
}

const insertValues = async(values)=>{
    try{
        if(values.role === "employee"){
            
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
        }else if(values.role==="Employer"){

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
            throw new Error("enter valid role ..") 
        }
    }catch(e){
        //console.log(e) ;
        throw new Error(e.message) ;
    }
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