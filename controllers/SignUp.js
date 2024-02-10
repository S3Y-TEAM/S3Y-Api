import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
const signUpController = async(req,res)=>{

    const {email , role , userName} = req.body ;
    
    

    res.status(201).json({test:"1"}) ;
}

const insertValues = async(values)=>{
    
}

export {
    signUpController
}