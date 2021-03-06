const { redirect } = require("express/lib/response");
const Comment = require("../models/comment");
const Post = require("../models/post");
const queue=require('../config/kue')
const commentsMailer=require('../mailers/comments_mailer')
const commentEmailWorker=require('../workers/comment_email_worker');
const Like = require("../models/like");
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();
      // Similar for comments to fetch the user's id!
      comment = await comment.populate('user', 'name email');
      // commentsMailer.newComment(comment)
      let job=queue.create('emails',comment).save(function(err){
        if(err){
          console.log("error in creating queue ",err)
        }
        console.log("job enqueued ",job.id)
      })
      if(req.xhr){
        
    
        return res.status(200).json({
          data:{
            comment:comment
          },
          message:"comment is created!!"
        })
      }
      req.flash('success','comment added successfully')
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error",err)
    return res.redirect("/");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // change:: destroy the associated likes for this comment
      await Like.deleteMany({likeable:comment._id,onModel:'Comment'})
      // send the comment id which was deleted back to the views
      if(req.xhr){
        return res.status(200).json({
          data:{
            comment_id:req.params.id
          },
          message:"post deleted"
        })
      }
      req.flash('success','comment deleted successfully')
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error",err)
    return res.redirect("/");
  }
};
