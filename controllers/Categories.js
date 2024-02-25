import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
import { responseBody } from "../utils/ResponseBody.js";
const categoriesController = async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token );
        let {role} = req.headers ;
        const specialization = role ;
        role = roleSelection(role) ;
        if(decodedToken){
            const categoriesList = await findCategories(specialization) ;
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
    return (role==="employee") ;
}

const isSameUserName = (userNameFromToken , userNameFromBody)=>{
    return (userNameFromToken === userNameFromBody) ;
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