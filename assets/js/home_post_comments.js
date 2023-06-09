
//this class would be initialized for every post on the page
// 1. when the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{

     // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        //call for all existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });

    }

    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    newComment.addClass('text-danger')
                    $(`#post-comments-${postId}`).prepend(newComment)
                    
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    //enable the functionality of the toggle like button on the new comment
                    new ToggleLike($('.toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: 'Comment published!',
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


    newCommentDom(comment){

        return $(`

        <li id="comment-${comment._id }" class="comment bg-secondary rounded-5 px-3 pb-1 d-flex justify-content-between mb-2">
            <div>
                <div class="username d-flex my-auto align-items-center">
                    <img src="${ comment.avatar }" class="post-avatar" style="height:30px;width:30px;">
                    <p class="mb-0 fs-6 fw-bold my-auto mt-3 mx-2 text-light">${ comment.user.name }</p>
                </div>
                <div class="content" >
                    <p class="mb-0 ms-4 ps-3 py-2 " style="color:rgba(255,255,255,0.7);">${ comment.content }</p>
                </div>
                <div class="like-comment ms-4 ps-3">
        
                        <a class="toggle-like-button text-white text-decoration-none" data-likes="${ comment.likes.length }" href="/likes/toggle/?id=${ comment._id }&type=Comment" >
                            <span> <i class="fa-regular fa-thumbs-up" ></i> </span>
                            ${ comment.likes.length } Like
                        </a>
        
                </div>
            </div>
            <div class="delete my-auto">
                
                <a href="/comments/destroy/${ comment.id }" class="text-decoration-none"><span><i class="bi bi-x-circle-fill fs-4 text-light"></i></span></a>
                    
            </div>
        </li>
        
        
        `);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: 'Comment Deleted!',
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
}