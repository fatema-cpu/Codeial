const express=require('express')

const app=express()
const port=8000

app.listen(port,function(error){
    if(error){
        console.log(`error while running the server: ${error}`)
        return
    }
    console.log(`server is running on port: ${port}`)
})