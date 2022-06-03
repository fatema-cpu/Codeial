const User = require("../models/user");

// manual auth
// module.exports.profile=function(req,res){
//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id,function(err,user){
//             if(user){
//                 return res.render('user_profile',{
//                     title:'User profile',
//                     user:user
//                 })
//             }
//             return res.redirect('/users/sign-in')
//         })
//     }
//     else{
//         return res.redirect('/users/sign-in')
//     }
// }

// passport profile page
module.exports.profile = function (req, res) {
  User.findById(req.params.id,function(err,user){
    res.render("user_profile", {
      title: "Codeial | Profile",
      profile_user:user
    });
  })
  
};

module.exports.update=function(req,res){
  if(req.user.id==req.params.id){
    User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
      return res.redirect('back')
    })
  }else{
    return res.status(401).send('Unauthorized')
  }
}

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  res.render("user_sign_up", {
    title: "Codeial | SignUp",
  });
};

// render the signin page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  res.render("user_sign_in", {
    title: "Codeial | SignIn",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in sign up!!");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user in sign up!!");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      res.redirect("back");
    }
  });
};

// sign in and create a session for the user manual auth
// module.exports.createSession=function(req,res){
//     User.findOne({email:req.body.email},function(err,user){
//         if(err){
//             console.log("error in finding user in sign in!!")
//             return
//         }
//         // handle user found
//         if(user){
//             // handle password which doesn't match
//             if(user.password!=req.body.password){
//                 return res.redirect('back')
//             }
//             // handle session creation
//             res.cookie('user_id',user.id)
//             return res.redirect('/users/profile')
//         }
//         // handle user not found
//         else{
//             return res.redirect('back')
//         }
//     })
// }

// create session using passport
module.exports.createSession = function (req, res) {
  req.flash('success','logged in successfully')
  return res.redirect("/");
};

// module.exports.signOut=function(req,res){
//     res.cookie('user_id','')
//     res.redirect('/users/sign-in')
// }

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success','You have logged out')
    res.redirect("/");
  });

  // return res.redirect('/');
};
