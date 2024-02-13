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
const app = express() ;

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


app.listen(PORT , ()=> {
    console.log(`app is listening on port ${PORT}`) ;
}
)

/***
 * Need role in req body to check if employee or employer
 * api/v1/ ...
 * [ 
 * /username -> check if username valid  (Done)
 * /categories -> response with all categories (employee only)(Done)
 * /email -> check if email is valid (Done)
 * /emailOtp -> response with valid code or not !!(Done)
 * /phone - > check if phone valid (Done)
 * /phoneOtp -> code !! (X)
 * /signUp -> store user data(Done)
 * /signIn -> !!
 * /logout -> !! 
 * /forgetPassword -> !!
 * /ResetPassword ->!!
 * ]
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */