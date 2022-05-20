const express=require('express')
const app=express()
const port=8000
const expressLayouts=require('express-ejs-layouts')

app.use(express.static('./assets'))

app.use(expressLayouts)
// extract style and scripts from the sub pages in the layout
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)

// use express router
app.use('/',require('./routes'))


// setting up view engine
app.set('view engine','ejs')
app.set('views','./views')

app.listen(port,function(error){
    if(error){
        console.log(`error while running the server: ${error}`)
        return
    }
    console.log(`server is running on port: ${port}`)
})