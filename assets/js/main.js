//Sends a DELETE request to /users to logout the current user
$("#logout").click((ev)=>{
    $.ajax({
        url: '/users',
        method: 'DELETE',
        data: {_csrf: window.SAILS_LOCALS._csrf},
        success: function(){
            window.location.reload();
        }
    })
});