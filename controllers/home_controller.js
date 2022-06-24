const Post = require("../models/post");
const User = require("../models/user");
module.exports.home = async function (req, res) {
  // console.log(req.cookies)
  // res.cookie('id',22)
  // Post.find({},function(err,posts){
  //     res.render('home',{
  //         title:"Codeial | home",
  //         posts:posts
  //     })
  // })
  try {
    // populate the user of each post
    let posts = await Post.find({})
    .sort('-createdAt')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate:{
          path:"likes"
        }
      })
      .populate('likes')
    let users = await User.find({})
    .sort('-createdAt');
    let user
      if(req.user){
        user =await User.findById(req.user._id)
        .populate({
          path:"friendships",
          populate:{
            path:"from_user"
          }
        })
        .populate({
          path:"friendships",
          populate:{
            path:"to_user"
          }
        })
      }
    
    return res.render("home", {
      title: "Codeial | home",
      posts: posts,
      all_users: users,
      user:user
    });
  } catch (err) {
    console.log("Error: ", err);
    return;
  }
};
