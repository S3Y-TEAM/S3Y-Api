import express from 'express' ;
const router = express.Router() ;
import {phoneController} from  '../controllers/Phone.js' ;
router.post('/phone',phoneController) ;

export {
    router as phoneRoute 
}