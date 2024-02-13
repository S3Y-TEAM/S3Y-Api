import express from 'express' ;
const router = express.Router() ;
import {resetPasswordController} from  '../controllers/ResetPassword.js' ;
router.post('/resetpassword',resetPasswordController) ;

export {
    router as resetPasswordRoute
}