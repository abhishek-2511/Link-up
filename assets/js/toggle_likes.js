//create a class to toggle likes when a link is clicked , using ajax
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            //this is a new way of writing ajax
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                let isLiked=false;
                

                if(data.data.deleted == true){
                    
                    likesCount -= 1;
                }else{

                    likesCount += 1;
                    isLiked=!isLiked
                   
                }
                console.log('current like count',likesCount);
                console.log(parseInt($(self).attr('data-likes')))
                $(self).attr('data-likes', likesCount);
                if(isLiked){
                     $(self).html(`<i class="fa-sharp fa-solid fa-thumbs-up" ></i> ${likesCount} ${likesCount===1?'like':'likes'}`);
                }
                else{
                    $(self).html(`<i class="fa-regular fa-thumbs-up" ></i> ${likesCount} ${likesCount===1?'like':'likes'}`);
                }
                
            })
            .fail(function(errData){
                console.log('error in completing the request');
            }); 
        });
    }
}