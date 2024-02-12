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
        
        if((decodedToken.phone === req.body.Phone_number)||(decodedToken.email===req.body.Email)){
        //const {email , role , userName} = req.body ;
        const values = req.body ;
        const workFactor = 10;
        let password = req.body.Password;
        
        // hashing password 
        bcrypt
        .genSalt(workFactor)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {
            password = hash ;
        })
        .catch(err => console.error(err.message));

        req.body.Password = password ;

        // create user
        const user = await insertValues(values) ;
        res.status(201).json(user) ;
        }else {
            res.status(400).json({error:  "unAuthorized to access this route !"})
        }
    }catch(e){
        res.status(400).json({error : e.message}) ;
    }
}

const insertValues = async(values)=>{
    if(values.role === "employee"){
        try{
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
                    Adress : values.Adress , 
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


        }catch(e){
            throw new Error("Already Registered ..")
        }
    }
}

export {
    signUpController
}