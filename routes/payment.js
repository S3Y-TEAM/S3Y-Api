import express from 'express' ;
const router = express.Router() ;
import {paymentController, paymentCallback} from  '../payments/paymob.js' ;
router.post('/payment',paymentController);
router.post('/callback', paymentCallback);

export {
    router as paymentRoute
}