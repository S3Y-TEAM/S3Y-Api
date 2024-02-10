import express from 'express' ;
const router =  express.Router() ;
import {signUpController} from '../controllers/SignUp.js' ;
router.post('/signup' , signUpController) ;

export {
    router as signUpRoute
}