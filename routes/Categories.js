import express from 'express' ;
const router = express.Router() ;
import {categoriesController} from  '../controllers/Categories.js' ;
router.post('/categories',categoriesController) ;

export {
    router as categoriesRoute 
}