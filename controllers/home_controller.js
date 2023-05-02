const Post = require("../models/post");

module.exports.home = async function(req, res){
   
    //console.log(req.cookies);
    //res.cookie('user_id', 25);

    try{
        //populate the user of each post
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec();
        
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    }
    catch(err){
        console.log("Error in Post controllers");
        return;
    }

}