const User=require('../models/user')

module.exports.profile=function(req,res){
    res.render('user_profile',{
        title:"user-profile"
    }
    )
}

// render the sign up page
module.exports.signUp=function(req,res){
    res.render('user_sign_up',{
        title:"Codeial | SignUp"
    })
}

// render the signin page
module.exports.signIn=function(req,res){
    res.render('user_sign_in',{
        title:'Codeial | SignIn'
    })
}

// get the sign up data
module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back')
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error in finding user in sign up!!")
            return
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log("error in creating user in sign up!!")
                    return 
                }
                return res.redirect('/users/sign-in')
            })
        }
        else{
            res.redirect('back')
        }
    })
}

// sign in and create a session for the user
module.exports.createSession=function(req,res){
    
}