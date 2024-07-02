import express from 'express' ;
const router =  express.Router() ;
import {signUpController} from '../controllers/SignUp.js' ;
// import multer from "multer";
// const upload = multer({ dest: 'uploads/' });
// router.post('/signup' ,upload.any() ,signUpController) ;
router.post('/signup' ,signUpController) ;

export {
    router as signUpRoute
}

/**
 * 
 * {
     "National_id" : "203050607080", 
     "Fname" : "s3y" , 
     "Lname" : "user" ,
     "Email" : "s3y@gmail.com" , 
     "Password" :"123456789" ,
     "Phone_number" : "0123456789" ,
     "country" : "Egypt" , 
     "city" : "cairo" , 
     "Address" : "cairo,6october" , 
     "user_name" : "s3y-user"  ,
     "categories" : [
        {"category_id" : 2} , 
        {"category_id" : 3}
     ] ,
     "Links" : [
        {
            "Linkedin":"http://Linkedin.com" , 
            "Github" : "http://Github.com"
        }
     ] , 
     "experience" : "1 year" ,
     
    
}
 */