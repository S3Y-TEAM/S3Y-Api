import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
const signUpController = async(req,res)=>{

    //const {email , role , userName} = req.body ;
    const values = req.body ;
    const user = await insertValues(values) ;
    res.status(201).json(user) ;
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
            //console.log(user) ;
            return user ;


        }catch(e){
            return {error : "Already Regisered .."}
        }
    }
}

export {
    signUpController
}