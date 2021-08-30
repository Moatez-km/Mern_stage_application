const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"please enter you name"],
        trim:true
    },
    email:{
        type: String,
        required :[true,"please enter you name"],
        trim:true
        
        
    },
     password:{
        type: String,
        required :[true,"please enter you name"],
        trim:true
    },
    role:{
        type: Number,
        default : 0  //0=user, 1=admin , 2 recruteur
    },
    avatar:{
        type: String,
        default:"https://res.cloudinary.com/rades/image/upload/v1629985521/avatar/avatar_yqomr2.png"
    }
},{
    timestamps: true
})


module.exports = mongoose.model("Users",userSchema);