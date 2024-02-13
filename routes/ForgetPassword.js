import express from 'express' ;
const router =  express.Router() ;
import {forgetPasswordController} from '../controllers/ForgetPassword.js' ;
router.post('/forgetpassword' , forgetPasswordController) ;

export {
    router as forgetPasswordRoute
}