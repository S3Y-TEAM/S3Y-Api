import  prisma  from "../db/prisma.js";
const emailController = async(req,res)=>{
    const {role , email} = req.body ;
    if(role === "employee" || role === "Employer"){
        const emailExist = await checkEmailExistance(role , email) ;
        if(emailExist){
            res.status(201).json({
                valid : 0 ,
            })
        }else {
            res.status(201).json({
                valid :1 ,
            })
        }
    }
    else {
        throw new Error('Enter Valid role !!!!!!') ;
    }
}

const checkEmailExistance = async(role , email)=>{
    const emailExist = await prisma[`${role}`].findUnique({
        where : {
            Email : email
        }
    })
    return (emailExist!=null) ;
}

export {
    emailController , 
    checkEmailExistance
}