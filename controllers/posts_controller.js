const Post = require('../models/post');
const Comment = require('../models/comment');

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

/*module.exports.destroy = function(req,res){

    Post.findById(req.params.id, function(err,post){

        //.id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id},function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}*/

module.exports.destroy = async function(req, res){

    try{
        const post =  await Post.findById(req.params.id);
       
        //.id means converting the object id into string
        //const id1 = post.user;
        //const id2 = req.user.id;

        if(post.user == req.user.id){
            await post.deleteOne();       //the error is coming from post.remove() function so changed it to post.deleteOne(); 
            
            await Comment.deleteMany({
                post: req.params.id
            });

            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(error){
        console.log("Error in deleting a post");
        return res.redirect('back');
    }
}
