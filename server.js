require('dotenv').config()
const express =require('express')
const mongoose =require('mongoose')
const cors =require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
//const config =require('./config/database');


const app=express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))

//connect to mongodb

const URI= process.env.MONGODB_URL
mongoose.connect(URI, err =>{
    if(err) throw err;
    console.log("Connected to mongodb")
})


//Routes
app.use('/user',require('./routes/userRouter'))


const PORT =process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('Server is running on port',PORT)

})

