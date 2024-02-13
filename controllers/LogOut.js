const logOutController = async(req,res)=>{
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(200).json({
        success : true
    })
}
export {
    logOutController
}