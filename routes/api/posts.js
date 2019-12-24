const express=require('express')

const router=express.Router()


const passport=require('passport')
const mongoose=require('mongoose')
const Post=require('../../models/Post')
const Profile=require('../../models/Profile')
const User=require('../../models/User')
const validatePostInput=require('../../validation/posts')

router.post('/',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const {errors,isValid}=validatePostInput(req.body)
    if(!isValid){
        return res.status(400).send(errors)
    }
    const post=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    })
    const p=await post.save()
    
    res.send(post)
})

router.get('/',async (req,res)=>{
    try{
    const posts= await Post.find({}).sort({date:-1})
    res.send(posts)
    }
    catch(e){
        res.status(404).send({noposts:'No posts found'})
    }

})

router.get('/:id',async (req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        console.log(post)
        res.send(post)
    } catch (e) {
        res.status(404).send({nopost:'No post found with this id'})
        
    }

})

router.delete('/:id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    try {
        const user= await User.findOne({_id:req.user.id})
        
        if(user){
            try{
            const post= await Post.findById(req.params.id)
            if(post.user.toString()!==req.user.id){
                res.status(401).send({unauthorized:'Unauthorized'})
            }
            await post.remove()
            res.send({succes:'true'})
            }
            catch(e){
                res.status(404).send({nopost:'No post found'})
            }
            
        }
        
    } catch (e) {
        res.send(e)
        
    }
})


router.post('/like/:id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    User.findOne({_id:req.user.id}).then(user=>{
        Post.findById(req.params.id)
        .then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id.toString()).length>0){
                
                return res.status(400).send({alreadyliked:'User has already liked the post'})
            }
            post.likes.unshift({user:req.user.id})
            post.save().then(post=>res.send(post))
        })
        .catch(err=>res.status(404).send({postnotfound:'No post found'}))

    })
       
})

router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    User.findOne({_id:req.user.id}).then(user=>{
        Post.findById(req.params.id)
        .then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id.toString()).length===0){
                
                return res.status(400).send({noliked:'You have not liked the post yet'})
            }
            const removeIndex=post.likes.map(item=>item.user.toString()).indexOf(req.user.id)
            post.likes.splice(removeIndex,1)
            post.save().then(post=>res.send(post))
        })
        .catch(err=>res.status(404).send({postnotfound:'No post found'}))

    })
       
})
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const {errors,isValid}=validatePostInput(req.body)
    if(!isValid){
        return res.status(400).send(errors)
    }

    try{
    const post = await Post.findById(req.params.id)
    const newComment={
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    }
    post.comments.unshift(newComment)
    await post.save()
    res.send(post)
    }
    catch(e){
        res.status(404).send({postnotfound:'No post found'})
    }
})


router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    try{
    const post = await Post.findById(req.params.id)
    
    if(post.comments.filter(comment=> comment._id.toString()===req.params.comment_id).length===0){
        return res.send({commentnotexists:'Comment does not exists'})
    }
    const removeIndex=post.comments.map(item=>item._id.toString()).indexOf(req.params.comment_id)
    post.comments.splice(removeIndex,1)
    await post.save()
    res.send(post)

    }
    catch(e){
        res.status(404).send(e)
    }
})









module.exports=router