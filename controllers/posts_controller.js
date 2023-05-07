const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req,res){
    
    try{
        let post = Post.create({
            content: req.body.content,
            user: req.user._id
        })

        req.flash('success', 'Post Published!');
        return res.redirect('back');

    }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){

    try{
        const post =  await Post.findById(req.params.id);
       
        //.id means converting the object id into string
        if(post.user == req.user.id){
            await post.deleteOne();       //the error is coming from post.remove() function so i have changed it to post.deleteOne(); 
            
            await Comment.deleteMany({
                post: req.params.id
            });

            req.flash('success', 'Post and Associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'you Cannot delete this post');
            return res.redirect('back');
        }
    }catch(error){
        req.flash('error', error);
        return res.redirect('back');
    }
}
