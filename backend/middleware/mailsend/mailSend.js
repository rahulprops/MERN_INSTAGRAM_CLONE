import  {createTransport} from 'nodemailer'
import 'dotenv/config.js'
import crypto from 'crypto'

const transport=createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:"rahulhack912@gmail.com",
        pass:process.env.PASS
    },
    tls: {
        rejectUnauthorized: false // Ignore self-signed certificate issue
    }
})
 
 export const verification = {};
 
const sendMail=async (req,res,next)=>{
    const {email}=req.body;

    

    if(!email){
        return res.status(404).json({message:"email not found"})
    }

    const token = crypto.randomBytes(10).toString("hex");
    const expires = Date.now() + 1 * 60 * 1000; // Token expires in 1 minute
    verification[email] = { token, expires };
    const userInfo={
        from:"rahulhack912@gmail.com",
        to:email,
        subject:"verify your accout",
        html:`Hi ${email}, please verify your account using the link below: <br> 
               <a href="http://localhost:9076/api/user/verify/${email}/${token}">Verify Account</a>`
    }
    try {
        // console.log(10)
           transport.sendMail(userInfo, (err,info)=>{
            if(err){
                return res.status(400).json({message:`mail sending error ${err.message}`})
            }
            console.log(`mail sending to user ${email}`)
            next()
           })
    } catch (err) {
        return res.status(500).json({message:`server mail error ${err.message}`})
    }
}
export default sendMail;