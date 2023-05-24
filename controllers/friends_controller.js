
const User = require('../models/user');
const Friendships = require('../models/friendship');
const Friendship = require('../models/friendship');

module.exports.toggle_friendship = async function(req,res){

    let from_id = req.user._id;
    let to_id = req.params.id;

    try{
        
        const existingFriendship = await Friendships.findOne({
            $or: [
                {from_user: from_id, to_user: to_id},
                {from_user: to_id, to_user: from_id}
            ]
        }).exec();

        //if already friend
        if(existingFriendship){
            
            //remove from the user who send the request and 'update users database'
            const removeFromUser = await User.findByIdAndUpdate(from_id,
                {$pull: {friends: existingFriendship._id}}
            ).exec();

            console.log(removeFromUser);
            
            //remove to the user who got the request and 'update users database'
            const removeToUser = await User.findByIdAndUpdate(to_id,
                {$pull: {friends: existingFriendship._id}}
            ).exec();


            //updating friendship database
            const deleteFriendship = await Friendship.deleteOne({
                $or: [
                    {from_user: from_id, to_user: to_id},
                    {from_user: to_id, to_user: from_id}
                ]
            }).exec();

            console.log('Deleted Friendship');
        }
        else{
            //create friendship in friendship database
            const newFriendship = await Friendship.create({from_user: from_id, to_user: to_id});
            newFriendship.save();

            //updating the user database
            const addFromUser = await User.findByIdAndUpdate(from_id, {
                $push : {friends: newFriendship._id}
            }).exec();

            const addToUser = await User.findByIdAndUpdate(to_id, {
                $push : {friends: newFriendship._id}
            }).exec();

        }

        return res.redirect('back');
    }
    catch(error){
        console.log('Error in Friends Controller', error);
    }
}
