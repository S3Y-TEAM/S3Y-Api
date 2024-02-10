import express from 'express' ;
const router = express.Router() ;
import {userNameController} from  '../controllers/UserName.js' ;
router.post('/username',userNameController) ;

export {
    router as userNameRoute 
}