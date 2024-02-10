import  prisma  from "../db/prisma.js";
import { isTokenValid } from "../utils/jwt.js";
const categoriesController = async(req,res)=>{
    const token = req.signedCookies.token;
    const decodedToken = isTokenValid({ token });
    
    if(req.body.role==="employee" && (decodedToken.userName === req.body.userName)){
    const categories = await prisma.category.findMany() ;
    res.status(200).json(categories) ;
    }else {
        res.status(400).json({
            error : "You are not allowed to access this page"
        })
    }
}
export {
    categoriesController ,
}