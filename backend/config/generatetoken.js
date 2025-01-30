import jwt from 'jsonwebtoken'

const generateToken=async (userId,res)=>{
  const token =  jwt.sign({userId},process.env.JWT,{expiresIn:"1d"})

  res.cookie("token",token,{
    httpOnly:true,
    maxAge:24*60*60*1000
  })
  return token;
}
export default generateToken;