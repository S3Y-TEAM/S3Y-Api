import { responseBody } from "../utils/ResponseBody.js";
const logOutController = async(req,res)=>{
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(200).json(responseBody("success" , "Bye..Byes" , 200 , null))
}
export {
    logOutController
}