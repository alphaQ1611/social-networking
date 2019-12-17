const express=require('express')

const router=express.Router()

const gravatar=require('gravatar')

const bcrypt=require('bcryptjs')

const keys =require('../../config/keys')

const User=require('../../models/User')

const jwt=require('jsonwebtoken')

const passport=require('passport')

const validateRegisterInput=require('../../validation/register')
const validateLoginInput=require('../../validation/login')



router.post('/register',async (req,res)=>{

    const {errors,isValid}=validateRegisterInput(req.body)
    if (!isValid){
        return res.status(400).send(errors)

    }
    const user= await User.findOne({email:req.body.email})
    if(user){
        errors.email='Email already exists!'
        return res.status(400).send(errors)
    }
    else{
        const avatar=gravatar.url(req.body.email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            avatar,
            password:req.body.password
        })
        console.log(user)
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err) throw err
                user.password=hash
                user.save()
                .then((user)=>{
                    return res.send(user)
                }).catch((e)=>{
                    return res.send(e)
                })
            })
        })

        
        

    }


})

router.post('/login', async (req,res)=>{

    const {errors,isValid}=validateLoginInput(req.body)
    if (!isValid){
        return res.status(400).send(errors)

    }

    const email=req.body.email
    const password =req.body.password
    try{
    const user =await User.findOne({email})
    if(user){
        const isMatch= await bcrypt.compare(password,user.password)
        
        if(isMatch){
            const payload={id:user.id,name:user.name,email:user.email,avatar:user.avatar}
            jwt.sign(payload,keys.secret,{expiresIn:36000},(err,token)=>{
                if(err){
                    res.send(err)
                }
                res.send({success:true,token:'Bearer '+token})
            })
        }
        else{
            errors.password="Password Incorrect"
            res.status(404).send(errors)
        }
    }
    else{
        errors.email='Email Not found!'
        res.status(404).send(errors)
    }
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/current',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    res.send({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    })
})

module.exports=router