const Comment = require('../models/comment');
const Post = require('../models/post');

//Deleting a Post (Authenticated)
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

//Deleting a Commented (Authorized)
module.exports.destroy = async function(req,res){
    
    try{
        const comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            await comment.deleteOne();

            const post = Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}});

            return res.redirect('back');

        }else{
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("Error in Deleting a Comment");
    }
}
