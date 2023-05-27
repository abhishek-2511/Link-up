
console.log('pop up script loaded');

function openForm(){
    document.getElementById('user-chat-box').style.display = 'block';

    //var chatMessagesDiv = document.getElementById('user-chat-box');
   // chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function closeForm(){
    document.getElementById('user-chat-box').style.display = 'none';
}

function pageRedirect(){
    console.log('Redirected script');

    window.location.href = 'http://localhost:8000/users/sign-in';
}

