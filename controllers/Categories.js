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
    if(role === "worker")role = "craftsman" ;
    else if(role === "dev")role = "developer" ;
    const categories = await prisma.category.findMany({
        where : {
            parent : role
        }
    }) ;
    return categories ;
} 


// remove comments when you need to add categories 
// const addCategories = async()=>{
//     try{
//         const categories = [
//             {
//                 name : "Software Development" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Data Science" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Machine Learning" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Web Development" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Mobile Development" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Game Development" ,
//                 parent : "developer"
//             },
//             {
//                 name : "Software Testing" ,
//                 parent : "developer"
//             },
//             {
//                 name : "carpentry" ,
//                 parent : "craftsman"
//             },
//             {
//                 name : "plumbing" ,
//                 parent : "craftsman"
//             },
//             {
//                 name : "electricity" ,
//                 parent : "craftsman"
//             },
//             {
//                 name : "painting" ,
//                 parent : "craftsman"
//             },
//             {
//                 name : "gardening" ,
//                 parent : "craftsman"
//             },
//             {
//                 name : "cleaning" ,
//                 parent : "craftsman"
//             }
//         ]
        

//         categories.forEach(async(category)=>{
//             await prisma.category.create({
//                 data : category
//             })
//         })
//     }catch(e){
//         console.log(e.message) ;
//     }
            

// }
export {
    categoriesController ,
}