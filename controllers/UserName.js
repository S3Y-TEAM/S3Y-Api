import  prisma  from "../db/prisma.js";
const userNameController = async(req,res)=>{
    const {role , userName} = req.body ;
    if(role === "employee" || role === "Employer"){
        const userNameExist = await checkUserNameExistance(role , userName) ;
        if(userNameExist){
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

const checkUserNameExistance = async(role , userName)=>{
    userName = userName.toLowerCase() ;
    const userNameExist = await prisma[`${role}`].findUnique({
        where : {
            user_name : userName
        }
    })
    return (userNameExist!=null) ;
}

export {
    userNameController , 
    checkUserNameExistance
}