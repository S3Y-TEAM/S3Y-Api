import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
const categoriesController = async(req,res)=>{
    try{
        const token = req.signedCookies.token;
        const decodedToken = isTokenValid({ token });
        console.log(req.headers) ;
        if(req.body.role==="employee" && (decodedToken.userName === req.body.userName)){
            const categoriesList = [] ;
            for(const cat of req.body.name){
                const categories = await prisma.category.create({
                    data : {
                        name : cat 
                    } 
                })
                categoriesList.push(categories) ;
            }
            
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
export {
    categoriesController ,
}