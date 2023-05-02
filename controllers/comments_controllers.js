const Comment = require('../models/comment');
const Post = require('../models/post');


/*module.exports.create = function(req,res){
    Post.findById(req.body.post, function(err,post){

        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){

                post.comments.push(comment);
                post.save();    //this will save in the Database

                res.redirect('/');
            });
        }
    });
}*/

module.exports.create = async function(req,res){
    
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();    //this will save in the Database

            await comment.save();
            res.redirect('/');
        }
    }
    catch(err){
        console.log("Error in commenting into a post");
        return;
    }
};
