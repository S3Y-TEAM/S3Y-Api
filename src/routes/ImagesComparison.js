import express from 'express' ;
const router = express.Router() ;
import {imagesComparisonController} from  '../controllers/ImagesComparison.js' ;
import multer from "multer";
const upload = multer({ dest: 'uploads/' });

router.post('/imagescomparison',upload.array('images' , 2),imagesComparisonController) ;

export {
    router as imagesComparisonRoute 
}