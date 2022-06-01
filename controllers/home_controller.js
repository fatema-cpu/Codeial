const Post=require('../models/post')
const User=require('../models/user')
module.exports.home=function(req,res){
    // console.log(req.cookies)
    // res.cookie('id',22)
    // Post.find({},function(err,posts){
    //     res.render('home',{
    //         title:"Codeial | home",
    //         posts:posts
    //     })
    // })

    // populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .exec(function(err,posts){
    User.find({},function(err,users){
        res.render('home',{
            title:"Codeial | home",
            posts:posts,
            all_users:users
        })
    })
 })
}