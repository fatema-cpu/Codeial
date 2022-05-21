const User=require('../models/user')

module.exports.profile=function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){
            if(user){
                return res.render('user_profile',{
                    title:'User profile',
                    user:user
                })
            }
            return res.redirect('/users/sign-in')
        })
    }
    else{
        return res.redirect('/users/sign-in')
    }
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
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error in finding user in sign in!!")
            return
        }
        // handle user found
        if(user){
            // handle password which doesn't match
            if(user.password!=req.body.password){
                return res.redirect('back')
            }
            // handle session creation
            res.cookie('user_id',user.id)
            return res.redirect('/users/profile')
        }
        // handle user not found
        else{
            return res.redirect('back')
        }
    })
}

module.exports.signOut=function(req,res){
    res.cookie('user_id','')
    res.redirect('/users/sign-in')
}
