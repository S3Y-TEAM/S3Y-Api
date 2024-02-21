import express from 'express' ;
import {userNameRoute} from './routes/UserName.js' ;
import { categoriesRoute } from './routes/Categories.js';
import { emailRoute } from './routes/Email.js';
import { phoneRoute } from './routes/Phone.js';
import {emailOtpRoute} from './routes/EmailOtp.js'
import {signUpRoute} from './routes/SignUp.js'
import {signInRoute} from './routes/SignIn.js'
import {forgetPasswordRoute} from './routes/ForgetPassword.js'
import {passwordOtpRoute} from './routes/PasswordOtp.js'
import {resetPasswordRoute} from './routes/ResetPassword.js'
import {logOutRoute} from "./routes/LogOut.js"
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit'
import cors from  'cors' ;
const app = express() ;
app.use(cors())
//console.log(cors) ;
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
const PORT = process.env.PORT || 8000 ;

app.use(express.json()) ;
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1' , userNameRoute) ;
app.use('/api/v1' , categoriesRoute) ;
app.use('/api/v1' , emailRoute) ;
app.use('/api/v1' , phoneRoute) ;
app.use('/api/v1' , emailOtpRoute) ;
app.use('/api/v1' , signUpRoute) ;
app.use('/api/v1' , signInRoute) ;
app.use('/api/v1' , forgetPasswordRoute) ;
app.use('/api/v1' , passwordOtpRoute) ;
app.use('/api/v1' , resetPasswordRoute) ;
app.use('/api/v1' , logOutRoute) ;

// limiter 
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

app.use(limiter)
app.listen(PORT , ()=> {
    console.log(`app is listening on port ${PORT}`) ;
}
)

