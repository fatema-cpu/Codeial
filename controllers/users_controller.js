const User = require("../models/user");
const fs=require('fs')
const path=require('path')
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
module.exports.profile =async function (req, res) {
  try{
    let user=await User.findById(req.params.id)
    let populated_user=await User.findById(req.user).populate('friendships')
    res.render("user_profile", {
      title: "Codeial | Profile",
      profile_user:user,
      populated_user:populated_user
    });
  }
  catch(err){
    console.log("Error", err);
    return;
  }
};

module.exports.update=async function(req,res){
  // if(req.user.id==req.params.id){
  //   User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
  //     return res.redirect('back')
  //   })
  // }else{
  //   return res.status(401).send('Unauthorized')
  // }
  if(req.user.id==req.params.id){
    try{
      let user=await User.findById(req.params.id)
      User.uploadedAvatar(req,res,function(err){
        if(err){
          console.log("Multer error :",err)
        }
        user.name=req.body.name
        user.email=req.body.email
        if(req.file){
          if(user.avatar && fs.existsSync(path.join(__dirname, "..", user.avtar))){
            fs.unlinkSync(path.join(__dirname,'..',user.avatar))
          }
          // this is saving the path of the uploaded file in the field of the user
          user.avatar=User.avatarPath+'/'+req.file.filename
        }
        user.save()
        return res.redirect('back')
      })
    }catch(err){
console.log("Error", err);
    return;
    }
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
