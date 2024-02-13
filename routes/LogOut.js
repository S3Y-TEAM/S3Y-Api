import express from 'express' ;
const router = express.Router() ;
import {logOutController} from  '../controllers/LogOut.js' ;
router.get('/logout',logOutController) ;

export {
    router as logOutRoute
}