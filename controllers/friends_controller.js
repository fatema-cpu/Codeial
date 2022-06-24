const Friendship = require("../models/friendship")
const User = require("../models/user")

module.exports.toggleFriend=async function(req,res){
    try{
        let fromUser=await User.findById(req.user)
        let toUser=await User.findById(req.query.id)
        let deleted=false
        // check if a friend already exists
        let existingFriendship=await Friendship.findOne({
            from_user:req.user,
            to_user:req.query.id
        })
        // check if friend exists then delete it
        if(existingFriendship){
            fromUser.friendships.pull(existingFriendship._id)
            toUser.friendships.pull(existingFriendship._id)
            fromUser.save()
            toUser.save()
            existingFriendship.remove()
            deleted=true
        }else{
            // create a friend
            let newFriend=await Friendship.create({
                from_user:req.user,
                to_user:req.query.id
            })
            fromUser.friendships.push(newFriend._id)
            fromUser.save()
        }
        return res.status(200).json({
            message: "Request successfull",
            data: {
              deleted: deleted,
            },
          });
    }
    catch(err){
        console.log("Error :", err);
    return res.status(500).json({
      message: "Internal server error",
    });
    }
}