import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
import {roleSelection} from './UserName.js'
const categoriesController = async(req,res)=>{
    try{
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        let {role} = req.headers ;
        role = roleSelection(role) ;

        if(isValidRole(role) && isSameUserName(decodedToken.userName ,req.body.userName)){
            const categoriesList = await insertCategories(req.body.name) ;
            res.status(200).json(categoriesList) ;
        }else {
            throw new Error("You are not allowed to access this page")
        }
    }catch(e){
        res.status(400).json({
            error : e.message 
        })
    }
}
const isValidRole = (role)=>{
    return (role==="employee") ;
}

const isSameUserName = (userNameFromToken , userNameFromBody)=>{
    return (userNameFromToken === userNameFromBody) ;
}

const insertCategories = async(categoriesNames)=>{
    let categoriesList = [] ;
    for(const cat of categoriesNames){
        const categories = await prisma.category.create({
            data : {
                name : cat  ,
            } 
        })
        categoriesList.push(categories) ;
    }
    return categoriesList ;
}
export {
    categoriesController ,
}