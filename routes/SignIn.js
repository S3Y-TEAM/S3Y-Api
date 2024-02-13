import express from 'express' ;
const router =  express.Router() ;
import {signInController} from '../controllers/SignIn.js' ;
router.post('/signin' , signInController) ;

export {
    router as signInRoute
}