import  prisma  from "../db/prisma.js";
const categoriesController = async(req,res)=>{
    const categories = await prisma.category.findMany() ;
    res.status(200).json(categories) ;
}
export {
    categoriesController ,
}