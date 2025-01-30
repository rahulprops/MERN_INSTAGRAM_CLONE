import jwt from 'jsonwebtoken'

const generateToken=async (userId,res)=>{
  const token =  jwt.sign({userId},process.env.JWT,{expiresIn:"1d"})

  res.cookie("refreshToken",token,{
    httpOnly:true,
    sameSite:"strict",
    maxAge:24*60*60*1000
  })
  
}
export default generateToken;