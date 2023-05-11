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

            //now making a xhr request for ajax
            if(req.xhr){
                //similar for comments to fetch the user's id
                comment = await comment.populate('user', 'name');

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            //await comment.save();

            req.flash('success' , 'Comment published!');

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

             // send the comment id which was deleted back to the views
            if(req.xhr){
                
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Deleted!"
                });
            }

            req.flash('success', 'Comment deleted!');

            return res.redirect('back');

        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }
    catch(error){
        req.flash('error', err);
        return;
    }
}
