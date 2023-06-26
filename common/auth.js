const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
// const secretKey='vdfvf52f41fd5vfd5151fvfd51'

const hashPassword=async(password)=>{
    let salt= await bcrypt.genSalt(10)
    let hashedPassword=await bcrypt.hash(password,salt)
    return hashedPassword
}

const hashCompare=async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}

const createToken=async(payload)=>{
    let token=await jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'2m'})
    return token
}

const validate=async(req,res,next)=>{
    if(req.headers.authorization){
        let token=req.headers.authorization.split(" ")[1]
        let data=await jwt.decode(token)
        if(Math.floor((+new Date())/1000) < data.exp){
            next()
        }else{
            res.status(402).send({message:"Token Expired"})
        }
    }else{
        res.status(400).send({message:"Token not Found"})
    }
}

const roleAdminGaurd=async(req,res,next)=>{
    if(req.headers.authorization){
        let token=req.headers.authorization.split(" ")[1]
        let data=await jwt.decode(token)
        if(data.role==="admin"){
            next()
        }else{
            res.status(402).send({message:"Only admins are allowed"})
        }
    }else{
        res.status(400).send({message:"Token not Found"})
    }
}

module.exports={hashPassword,hashCompare,createToken,validate,roleAdminGaurd}