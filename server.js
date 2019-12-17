const express =require('express')

const users=require('./routes/api/users')

const profile=require('./routes/api/profile')

const posts=require('./routes/api/posts')

const bodyParser=require('body-parser')

const passport =require('passport')


const app=express()

const mongoose=require('mongoose')
mongoose.Promise=global.Promise

const db=require('./config/keys').mongoURI

const port=process.env.PORT||8000

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
mongoose.set('useFindAndModify',false)

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('DB connected!')
}).catch((e)=>{
    console.log(e)
})

app.use(passport.initialize())

require('./config/passport')(passport)

app.use('/api/users',users)
app.use('/api/posts',posts)
app.use('/api/profile',profile)

app.listen(port,()=>{
    console.log("The server is up and running!")
})