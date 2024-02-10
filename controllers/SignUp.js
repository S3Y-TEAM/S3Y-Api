import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
const signUpController = async(req,res)=>{

    const {email , role , userName} = req.body ;
    let checkForDate = 1 ;
    // check for mail existance
    const emailExist = await checkEmailExistance(role,email) ;
    checkForDate^=emailExist ; 
    // check for username existane
    const userNameExist = await checkUserNameExistance(role,userName) ;
    checkForDate^=userNameExist ;
    
    
    res.status(201).json({test:"1"}) ;
}


export {
    signUpController
}