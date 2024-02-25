import express from 'express' ;
const router = express.Router() ;
import {emailOtpController} from  '../controllers/EmailOtp.js' ;
router.get('/emailotp',emailOtpController) ;

export {
    router as emailOtpRoute
}