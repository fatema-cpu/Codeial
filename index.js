const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const port=8000
const expressLayouts=require('express-ejs-layouts')
const db=require('./config/mongoose')
const bodyParser=require('body-parser')
// used for session cookie
const session=require('express-session')
const passport=require('passport')
const passportLocal=require('./config/passport-local-strategy')

// middlewares starting 
app.use(bodyParser.urlencoded({extended:false}))

app.use(cookieParser())

app.use(express.static('./assets'))

app.use(expressLayouts)
// extract style and scripts from the sub pages in the layout
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)


// middlewares ending

// setting up view engine
app.set('view engine','ejs')
app.set('views','./views')

app.use(session({
    name:'codeial',
    // TODO change the secret before deployment in production
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// use express router
app.use('/',require('./routes'))

app.listen(port,function(error){
    if(error){
        console.log(`error while running the server: ${error}`)
        return
    }
    console.log(`server is running on port: ${port}`)
})