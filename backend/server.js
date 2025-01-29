import express from 'express'
import 'dotenv/config.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
const port=process.env.PORT || 3000

//! middleware 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors({
    origin:"",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
//! server start
app.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
})