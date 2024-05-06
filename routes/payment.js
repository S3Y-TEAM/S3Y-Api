import express from 'express' ;
const router = express.Router() ;
import {paymentController} from  '../payments/paymob.js' ;
router.get('/payment',paymentController) ;

export {
    router as paymentRoute
}