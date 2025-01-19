const users=require('../model/signM')
const path=require('path')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
function isstringvalid(string){
    if(string==undefined || string.length===0){
        return true
    }else{
        return false
    }
}
const addD=(req,res)=>{
    try{
    const {name,email,password}=req.body;
    if(isstringvalid(name) || isstringvalid(email) || isstringvalid(password)){
            return res.status(400).json({err:"something is missing"})
        }
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        //console.log(err)
        await users.create({name, email, password:hash})
        res.status(201).json({message:'succesfuly created'})
    })
}   
catch(err){
    res.status(500).json(err);
}
}
const generateAccessToken = (id,name,ispremiumuser) => {
    return jwt.sign({signUpId : id,name:name,ispremiumuser} ,'secretkey');
}


const login=async (req, res) => {
    try{
    const { email, password } = req.body;
    if(isstringvalid(email) || isstringvalid(password)){
        return res.status(400).json({message: 'EMail id password is missing ', success: false})
    }
    console.log(password);
    const user  = await users.findAll({ where : { email }})
        if(user.length > 0){
           bcrypt.compare(password, user[0].password, (err, result) => {
           if(err){
            throw new Error('Something went wrong')
           }
            if(result === true){
                return res.status(200).json({success: true, message: "User logged in successfully",token: generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser)})
            }
            else{
            return res.status(400).json({success: false, message: 'Password is incorrect'})
           }
        })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}
const isPremiumUser=async(req,res,next)=>{
    try{
        console.log(req.signUp.ispremiumuser)
        if(req.signUp.ispremiumuser){
            return res.json({ispremiumuser:true});
        }
        else{
            return res.json({ispremiumuser:false})
        }
    }catch(error){
        console.log(error);
    }
}
module.exports={addD,login,generateAccessToken,isPremiumUser}

    
