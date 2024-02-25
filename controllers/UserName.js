import  prisma  from "../db/prisma.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { responseBody } from "../utils/ResponseBody.js";
const userNameController = async(req,res)=>{
    const {userName} = req.body ;
    try{
        if(!validUserName(userName)){
            throw new Error("invalid user name") ;
        }
        let {role} = req.headers
        role = roleSelection(role) ;
        
        const userNameExistInEmployee = await checkUserNameExistance('employee' , userName) ;
        const userNameExistInEmployer = await checkUserNameExistance('Employer' , userName) ;
        if(userNameExistInEmployee || userNameExistInEmployer){
            throw new Error("user name already exist ")
        }else {
            const payload = {
                userName : userName , 
                role
            }
            let token =  attachCookiesToResponse(res,payload) ;
            res.setHeader('Authorization', `Bearer ${token}`)
            res.status(200).json(responseBody("success" , "valid user name" , 200 , {userName})) ;
        }
        
    }catch(e){
        res.status(400).json(responseBody("failed" , e.message , 400 , {userName})) ;
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

const roleSelection = (role)=>{
    if(role === "dev" || role==="worker")role="employee" ;
    else if(role==="emp")role="Employer" ;
    else throw new Error("invalid role") ;
    return role ;
}

const validUserName = (userName)=>{
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    return (usernameRegex.test(userName)) ;
}
export {
    userNameController , 
    checkUserNameExistance ,
    roleSelection , 
}