import express from 'express' ;
const router = express.Router() ;
import {emailController} from  '../controllers/Email.js' ;
router.post('/email',emailController) ;

export {
    router as emailRoute 
}