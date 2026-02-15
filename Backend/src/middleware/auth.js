const jwt = require("jsonwebtoken")
const USER = require("../models/users")

const auth= async(req,res,next)=>{
    try{
        const token= req.header("Authorization").replace("Bearer","").trim()
        const decoded= jwt.verify(token,process.env.TOKEN) 
        const user = await USER.findOne({_id:decoded._id,"tokens.token":token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user  = user
        next()
    }
    catch(e){
        res.status(401).send({error:"Authenticate first please"})
    }
}
module.exports=auth
    