import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
import { responseBody } from "../utils/ResponseBody.js";
import { attachCookiesToResponse } from "../utils/jwt.js";

const categoriesController = async(req,res)=>{
    try{
        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token );
        let {role} = req.headers ;
        const specialization = role ;
        role = roleSelection(role) ;
        // check for userName !!!!!!!!!!!!!!!!!!!1
        isValidRole(role) ;
        if(decodedToken){
            const categoriesList = await findCategories(specialization) ;
            const payload = {
                userName : req.body.userName , 
                role
            }
            
            token =  attachCookiesToResponse(res,payload) ;
            res.setHeader('Authorization', `Bearer ${token}`)
            res.status(200).json(responseBody("success" , `categories of ${specialization}` , 200 , categoriesList)) ;
        }else {
            throw new Error("You are not allowed to access this page")
        }
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , null));
    }
}
const isValidRole = (role)=>{
    if(role==="employee")return 1 ;
    else throw new Error('You are not allowed to access this page please ensure that you enrolled as an employee')
}

const findCategories = async(role)=>{
    const categories = await prisma.category.findMany({
        where : {
            parent : role
        }
    }) ;
    return categories ;
} 

export {
    categoriesController ,
}