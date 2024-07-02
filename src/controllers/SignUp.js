import prisma from '../db/prisma.js' ;
import { checkEmailExistance } from './Email.js';
import {checkUserNameExistance} from './UserName.js'
import bcrypt from "bcrypt" ;
import { isTokenValid } from "../utils/jwt.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import { roleSelection } from "./UserName.js";
import { encryptPasswords } from './ResetPassword.js';
import { responseBody } from '../utils/ResponseBody.js';
import { isValidEmail } from './Phone.js';
import { isValidUserName } from './Email.js';
import { uploadFile } from './ImagesComparison.js';

const signUpController = async(req,res)=>{
    
    try{

        let {role} = req.headers ;
        role = roleSelection(role) ;

        if(role ==="employee"){
        if(req.body.Links)req.body.Links = JSON.parse(req.body.Links);
        else req.body.Links = [] ;

        if(req.body.categories)req.body.categories = JSON.parse(req.body.categories);
        else req.body.categories = [] ;
        
        if(req.body.projects)req.body.projects = JSON.parse(req.body.projects);
        else req.body.projects = [] ;
        }
        
        

        let token = req.headers.authorization.split(' ')[1] ;
        const decodedToken = isTokenValid(token);
        let {Email , user_name  ,Phone_number} = req.body ;

        if(role === "employee"){
            let National_id = req.body.National_id ;
            await isValidNationalId(National_id,role) ;
        }

        isValidPhone(decodedToken.phone ,Phone_number) ;
        isValidEmail(decodedToken.email ,Email)
        isValidUserName(decodedToken.userName , user_name) ;
    
        if(decodedToken){
            
            
            const workFactor = 10;
            let password = req.body.Password;
             
            // hashing password 
            password = await encryptPasswords(password , workFactor) ;
            
            req.body.Password = password ;
            
            // for employee only !
            if(role === "employee"){
                let certificatesField ;
                let projectsField ;
                
                certificatesField = await getFieldOf(req.files , 'certificates') ;
                projectsField = await getFieldOf(req.files , 'projects');
                
            
                req.body.certificates = await getFileFromResponse(certificatesField,  'amr') ;
                let projectsPaths =  await getFileFromResponse(projectsField,  'amr') ;
            
                let projectsList = [] ;
                let indexOfProjectPaths = 0 ;
                if(projectsPaths.length !== 0){
                    for(let project of req.body.projects){
                        project.path =  projectsPaths[indexOfProjectPaths].path ;
                        projectsList.push(project) ;
                        indexOfProjectPaths++;
                    }
                }
                req.body.projects = projectsList ;
            }
            //


            const values = req.body ;
            let user = await insertValues(values , role) ;
            delete user.Password ;
            const payload = user ;
            

            token = attachCookiesToResponse(res,payload) ;
            res.setHeader('Authorization', `Bearer ${token}`)
            res.status(201).json(responseBody("success" , "successfully registered" , 201 , {user})) ;
        }else {
            throw new Error("unAuthorized to access this route !")
        }
    }catch(e){
        
        res.status(400).json(responseBody("failed" , e.message , 400 , null)) ;
    }
}



const insertValues = async(values , role)=>{
    
    try{
        if(role === "employee"){
            
                const user = await prisma.employee.create({
                    data: {
                        National_id : values.National_id , 
                        Fname : values.Fname , 
                        Lname : values.Lname ,
                        Email : values.Email , 
                        Password :values.Password ,
                        Phone_number : values.Phone_number ,
                        Personal_image :  "0xop" ,
                        National_image : "0xtp",
                        country : values.country , 
                        city : values.city , 
                        Address : values.Address , 
                        user_name : values.user_name , 
                        experience : values.experience ,
                        verified : 1 , 
                        Links : {
                            create : values.Links 
                        }    , 
                        certificates : {
                            create : values.certificates
                        } ,
                        projects : {
                            create : values.projects
                        } ,
                        employee_has_category : {
                            create : values.categories
                        }
                    }
                })
                
                return user ;
        }else if(role==="Employer"){

            const user = await prisma.Employer.create({
                data: {
                    Fname : values.Fname , 
                    Lname : values.Lname ,
                    Email : values.Email , 
                    Password :values.Password ,
                    Phone_number : values.Phone_number ,
                    img : values.Personal_image ,
                    country : values.country , 
                    city : values.city , 
                    Address : values.Address , 
                    user_name : values.user_name , 
                }
            })
            
            return user ;


        }else {
            throw new Error("invalid role ..") 
        }
    }catch(e){
        throw new Error(e.message) ;
    }
}

const isValidNationalId = async(id , role)=>{
    const user = await prisma[`${role}`].findUnique({
        where :{
            National_id : id
        }
    })
    if(user){
        throw new Error ('invalid national id') ;
    }
    return true ;
}

const isValidPhone = (phoneFromToken , phoneFromBody)=>{
    if(phoneFromToken === phoneFromBody)return 1 ;
    else throw new Error('You are not allowed to access this page !!!!!!') ;
}



const getFileFromResponse = async(fieldList , userName)=>{
    let fieldsNumber = 0 ;
    let listOfFilesPaths =  [] ;
    if(!fieldList)return [] ;
    for(let fileObj of fieldList){
            let pathValue = fileObj.path ;
            let extensionType = fileObj.mimetype.split('/').pop()
            let fieldName = fileObj.fieldname ;
            const dropboxPath = `/${userName}/${fieldName}/${fieldsNumber}.${extensionType}` ;
            listOfFilesPaths.push({path : dropboxPath});
            fieldsNumber++;
            await uploadFile(pathValue , dropboxPath) ;
    }
    return listOfFilesPaths ;
}

const getFieldOf = async(files , fieldName)=>{
    let listOfFields = [] ;
    if(!files)return [] ;
    for(let fieldObj of files){
        if(fieldObj.fieldname === fieldName)listOfFields.push(fieldObj) ;
    }
    return listOfFields ;
}

export {
    signUpController ,
    isValidPhone ,
    getFileFromResponse ,
    getFieldOf
}


/**
 * {
     "role" : "employee" ,
     "National_id" : "qwerwrwq215650744445678930" , 
     "Fname" : "7sm2ard2o1o30" , 
     "Lname" : "7a2aa31d0" ,
     "Email" : "amrkhaled6025@gmail.com" , 
     "Password" :"7a565655670" ,
     "Phone_number" : "999924244441150" ,
     "Personal_image" : "0xa2252151510" ,
     "country" : "Egaypt" , 
     "city" : "cairao" , 
     "Address" : "cairo,6octaober0" , 
     "user_name" : "qqqqsswp444aaoa30" ,  
     "Links" : [
        {
            "Linkedin":"http://Linkedin.com" , 
            "Github" : "http://Github.com"
        }
     ]  , 
     "certficates" : [
        {"name" : "ccnaaa"} ,
        {"name" : "lplplp"}
     ] , 
     "categories" : [
        {"category_id" : 2} , 
        {"category_id" : 3}
     ]
    
}
 * 
 * 
 */