
const Post = require("../models/post");
const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.home = async function(req, res){

    try{
        //populate the user of each post
        
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
        })
        //pre populating the likes
        .populate ({
            path: 'comments',
            populate: {
                path: 'likes',
            },
        })
        .populate('likes');

        //To display all users
        let users = await User.find({});

        //finding the friends of the logged in user
        let friends = new Array();
        
        //friends list will only be loaded if the user is signed in
        if (req.user){
            //checking the friendship model in the fields "from user" and "to_user" 
            //the current logged in user has to be in one of them. and at the same time we are also populating it to see the user ids
            let all_friendships = await Friendship.find({
                $or: [
                    {from_user: req.user._id}, 
                    {to_user: req.user._id}
                ]
            }).populate('from_user')
            .populate('to_user');

            for(let fs of all_friendships){

                if(fs.from_user?._id.toString() == req.user?._id.toString()){

                    friends.push({
                        friend_name: fs.to_user?.name,
                        friend_id: fs.to_user?._id,
                        friend_avatar: fs.to_user?.avatar
                    });
                }
                else if(fs.to_user._id.toString() == req.user._id.toString()){
                    
                    friends.push({
                        friend_name: fs.from_user?.name,
                        friend_id: fs.from_user?._id,
                        friend_avatar: fs.from_user?.avatar
                    });
                }
            }
        }

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
            friends: friends,
        });
    }
    catch(err){
        console.log("Error in Home controllers",err);
        return;
    }

}