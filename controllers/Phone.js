import  prisma  from "../db/prisma.js";
const phoneController = async(req,res)=>{
    const {role , phone} = req.body ;
    if(role === "employee" || role === "Employer"){
        const phoneExist = await checkPhoneExistance(role , phone) ;
        if(phoneExist){
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

const checkPhoneExistance = async(role , phone)=>{
    const phoneExist = await prisma[`${role}`].findFirst({
        where : {
            Phone_number : phone
        }
    })
    return (phoneExist!=null) ;
}

export {
    phoneController
}