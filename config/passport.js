const keys=require('./keys')



const JwtStrategy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const mongoose=require('mongoose')
const User=mongoose.model('users')
var opts={}
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=keys.secret



module.exports=(passport)=>{
    passport.use(new JwtStrategy(opts, async (jwt_payload,done)=>{
        try{
        const user= await User.findById(jwt_payload.id)
        if(user){
            return done(null,user)
        }
        else{
            return done(null,false)
        }
        }
        catch(e){
            console.log(e)
        }

    }))
}