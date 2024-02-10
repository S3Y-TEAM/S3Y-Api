import express from 'express' ;
const router = express.Router() ;
import {categoriesController} from  '../controllers/Categories.js' ;
router.get('/categories',categoriesController) ;

export {
    router as categoriesRoute 
}