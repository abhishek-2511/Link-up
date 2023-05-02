const Post = require('../models/post');


module.exports.create = async function(req,res){
    
    try{
        let post = Post.create({
            content: req.body.content,
            user: req.user._id
        })

        return res.redirect('back');

    }
    catch(err){
        console.log("Error in Creating a post");
        return;
    }
}