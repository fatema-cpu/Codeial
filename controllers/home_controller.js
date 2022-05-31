const Post=require('../models/post')

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
    Post.find({}).populate('user').exec(function(err,posts){
        res.render('home',{
            title:"Codeial | home",
            posts:posts
        })
    })
}