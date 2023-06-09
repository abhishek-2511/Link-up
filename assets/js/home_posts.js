
{
    //method to submit the form data for new post using Ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        
        newPostForm.submit(function(e){
            
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    //console.log(data);

                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    
                    deletePost($('.delete-post-button', newPost));

                    //call the create comment class
                    new PostComments(data.data.post._id);

                    //enable the functionality of the toggle like button the new post
                    new ToggleLike($('.toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: 'Post published!',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    
                    }).show();

                }, 
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    //method to create a post in DOM
    let newPostDom = function(post){
        //show the count of zero likes on this post
        return $(`<li id="post-${ post._id }" style="width:90%;margin-left: 3%;" class="each-post">


        <p>
            <div class="avatar-cross">
                <div class="post-users-name d-flex align-items-center">
                    <img src="${ post.user.avatar }" class="post-avatar" style="height:35px; width: 35px;">
                    <p class="mb-0 fs-5 fw-bold mx-2 mt-2" style="position:relative;top:3px;">${ post.user.name }</p>
                </div>
                    <a href="/posts/destroy/${ post._id }" style="text-decoration: none;" class="mt-3">
                        <i class="bi bi-trash3-fill fs-4 text-danger"></i>
                    </a>
               
    
            </div>
            <br>
            <hr class="horizontal-line">
            ${ post.content }
            <br>
        
            
            <br>
            <small>
                
                    <a class="toggle-like-button" data-likes="${ post.likes.length }"  href="/likes/toggle/?id=${post._id }&type=Post" style="color:white;text-decoration: none;">
                        <span><i class="fa-regular fa-thumbs-up" ></i> </span>${ post.likes.length } Like
                    </a>
                   
               
            </small>
    
        </p>
        <div class="post-comments">
               
                    
                <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST" onsubmit="hello()" >
                    <input type="text" name="content" placeholder="Type here to add comment..." required class="add-text p-2 px-3" id="postComment">
                    <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Post" class="add-button px-3 btn ms-2 text-white"> 
    
                </form>
    
    
            <h4>Comments</h4>
    
           
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                   
    
                </ul>
    
            </div>
        </div>
    </li>`)}


    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){

                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    // loop over all the existing posts on the page 
    //(when the window loads for the first time) and 
    //call the delete post method on delete link of each, 
    //also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){

        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            //get the post's id by splitting the id attribute
            let postId = self.prop('id').split('-')[1]
            new PostComments(postId);
        });
    }


    createPost();
    convertPostsToAjax();
}