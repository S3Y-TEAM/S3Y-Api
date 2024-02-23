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
        
        if(isValidRole(role)){
            const userNameExistInEmployee = await checkUserNameExistance('employee' , userName) ;
            const userNameExistInEmployer = await checkUserNameExistance('Employer' , userName) ;
            if(userNameExistInEmployee || userNameExistInEmployer){
                throw new Error("user name exist ")
            }else {
                const payload = {
                    userName : userName , 
                    role
                }
                const token =  attachCookiesToResponse(res,payload) ;
                res.status(200).json(responseBody("success" , "valid user name" , 200 , {userName})) ;
            }
        }
        else {
            throw new Error("enter valid role") ;
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
    return role ;
}

const isValidRole = (role)=>{
    return (role === "employee" || role === "Employer") ;
}

const validUserName = (userName)=>{
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    return (usernameRegex.test(userName)) ;
}
export {
    userNameController , 
    checkUserNameExistance ,
    roleSelection , 
    isValidRole
}