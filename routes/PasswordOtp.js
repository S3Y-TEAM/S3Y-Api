import express from 'express' ;
const router = express.Router() ;
import {passwordOtpController} from  '../controllers/PasswordOtp.js' ;
router.post('/passwordotp',passwordOtpController) ;

export {
    router as passwordOtpRoute
}