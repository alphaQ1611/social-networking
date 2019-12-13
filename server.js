const express =require('express')

const users=require('./routes/api/users')

const profile=require('./routes/api/profile')

const posts=require('./routes/api/posts')


const app=express()

const mongoose=require('mongoose')

const db=require('./config/keys').mongoURI

const port=process.env.PORT||3000

mongoose.connect(db).then(()=>{
    console.log('DB connected!')
}).catch((e)=>{
    console.log(e)
})

app.get('/',(req,res)=>{
    res.send('Hello!')
})

app.use('/api/users',users)
app.use('/api/posts',posts)
app.use('/api/profile',profile)

app.listen(port,()=>{
    console.log("The server is up and running!")
})