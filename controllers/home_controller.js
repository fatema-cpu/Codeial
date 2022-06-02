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
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    let users = await User.find({});
    return res.render("home", {
      title: "Codeial | home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error: ", err);
    return;
  }
};
