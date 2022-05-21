const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost/codeial_development")

const db=mongoose.connection

db.on('error',console.error.bind(console,"error while connecting to db"))

db.once('open',function(){
    console.log("Successfully connected to db")
})

module.exports=db