const express=require('express')

const router=express.Router()

const mongoose=require('mongoose')
const validateProfileInput=require('../../validation/profile')

const passport=require('passport')

const Profile=require('../../models/Profile')
const User=require('../../models/User')

const validateExperienceInput=require('../../validation/experience')
const validateEducationInput=require('../../validation/education')

router.get('/test',(req,res)=>{
    res.json({msg:'Profile Work!'})
})

router.get('/',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    let errors={}
    try{
    const profile= await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
    if(!profile){
        errors.noprofile="There is no profile for this user!"
        res.status('404').send(errors)
    }
    else{
        res.send(profile)
    }
    }
    catch(e){
        res.send(e)
    }
})
router.get('/handle/:handle',async (req,res)=>{
    let errors={}
    try{
        const profile=await Profile.findOne({handle:req.params.handle}).populate('user',['name','avatar'])
        if(!profile){
            errors.noprofile="There is no profile for this handle!"
            res.status(404).send(errors)
        }
        res.send(profile)
    }
    catch(e){
        res.status(400).send({noprofile:"There is no profile for this handle"})
    }
})

router.get('/user/:user_id',async (req,res)=>{
    let errors={}
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
        if(!profile){
            errors.noprofile="There is no profile for this handle!"
            res.status(404).send(errors)
        }
        res.send(profile)
    }
    catch(e){
        res.status(400).send({noprofile:"There is no profile for this handle"})
    }
})


router.get('/all',async (req,res)=>{
    const errors={}
    try{
        const profiles=await Profile.find({}).populate('user',['name','avatar'])
        if(!profiles){
            errors.noprofile="There are no profiles"
            res.status(404).send(errors)

        }
        res.send(profiles)
    }
    catch(e){
        res.status(400).send({noprofile:"There are no profiles"})
    }
})

router.post('/experience',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const {errors,isValid}=validateExperienceInput(req.body)
    
    if(!isValid){
        return res.status(400).send(errors)
    }
    const profile=await Profile.findOne({user:req.user.id})
    const newExp={
        title:req.body.title,
        company:req.body.company,
        location:req.body.location,
        from:req.body.from,
        to:req.body.to,
        current:req.body.current,
        description:req.body.description
    }
    profile.experience.unshift(newExp)
    try{
    const prof=await profile.save()
    

    res.send(prof)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/education',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const {errors,isValid}=validateEducationInput(req.body)
    
    if(!isValid){
        return res.status(400).send(errors)
    }
    const profile=await Profile.findOne({user:req.user.id})
    const newEdu={
        school:req.body.school,
        degree:req.body.degree,
        fieldofstudy:req.body.fieldofstudy,
        from:req.body.from,
        to:req.body.to,
        current:req.body.current,
        description:req.body.description
    }
    profile.education.unshift(newEdu)
    try{
    const prof=await profile.save()
    

    res.send(prof)
    }
    catch(e){
        res.status(400).send(e)
    }
})



router.post('/',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const profileFields={}
    const {errors,isValid}=validateProfileInput(req.body)
    
    if(!isValid){
        return res.status(400).send(errors)
    }
    profileFields.user=req.user.id
    if(req.body.handle) profileFields.handle=req.body.handle

    if(req.body.company) profileFields.company=req.body.company
    if(req.body.status) profileFields.status=req.body.status

    if(req.body.website) profileFields.website=req.body.website

    if(req.body.location) profileFields.location=req.body.location

    if(req.body.bio) profileFields.bio=req.body.bio

    if(req.body.githubusername) profileFields.githubusername=req.body.githubusername
    if(typeof req.body.skills !='undefined')
    profileFields.skills=req.body.skills.split(',')
    profileFields.social={}

    if(req.body.youtube) profileFields.social.youtube=req.body.youtube
    if(req.body.twitter) profileFields.social.twitter=req.body.twitter
    if(req.body.linkedin) profileFields.social.linkedin=req.body.linkedin
    if(req.body.facebook) profileFields.social.facebook=req.body.facebook
    if(req.body.instagram) profileFields.social.instagram=req.body.instagram

    const profile=await Profile.findOne({user:req.user.id})
    if(profile){
        const prof=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
        res.send(prof)
    }
    else{
        const handle=await Profile.findOne({handle:req.user.handle})
        if(handle){
            errors.handle="Handle already taken!"
            res.status(400).send(errors)
        }
        else{
            const profile=await new Profile(profileFields).save()
            res.send(profile)

        }
    }

})


router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const profile=await Profile.findOne({user:req.user.id})
    const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex,1)
    const prof=await profile.save()
    res.send(prof)

})
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const profile=await Profile.findOne({user:req.user.id})
    const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id)
    profile.education.splice(removeIndex,1)
    const prof=await profile.save()
    res.send(prof)

})


router.delete('/',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const profile=await Profile.findOneAndDelete({user:req.user.id})
    const user=await User.findOneAndDelete({_id:req.user.id})
    res.send({Success:true})
})

module.exports=router