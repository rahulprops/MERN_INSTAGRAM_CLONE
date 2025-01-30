const errorHandler=(res,status,message,data,token)=>{
     res.status(status).json({
        message,
        data,
        token
    })
}
export default errorHandler;