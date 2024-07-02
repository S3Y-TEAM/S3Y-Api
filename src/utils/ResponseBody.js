
const responseBody = (result , message  , statusCode , data)=>{
    return {
        result , 
        message , 
        status : statusCode , 
        data
    }
}

export  {
    responseBody
}