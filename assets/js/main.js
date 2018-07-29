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

$("#requestTutorship").click((ev)=>{
    var $triggerBtn = $(ev.target);
    var id = $triggerBtn.data("tutorship-id");
    $triggerBtn.attr("disabled", true);
    $.ajax({
        url: "/tutorships/"+id+"/request",
        method: "POST",
        data: { _csrf: window.SAILS_LOCALS._csrf },
        success: function(){
            $triggerBtn.html("Solicitud pendiente");
        }
    })
})

$(".accept-tutorship-request").click((ev)=>{
    var $triggerBtn = $(ev.target);
    var id = $triggerBtn.data("request-id");
    $triggerBtn.attr("disabled", true);
    $.ajax({
        url: "/tutorships/request/"+id,
        method: 'POST',
        data:{ _csrf: window.SAILS_LOCALS._csrf, action: 'accept' },
        success: function(res){
            alert(res)
        }
    }) 
})

$(document).ready(()=>{
    if(window.SAILS_LOCALS.user !== null){
        $.ajax({
            url: "/notifications",
            method: "GET",
            success: function(res){
                $("#notifications").html();
                if(res.length <= 0)
                    $("#notifications").append(`<li class="dropdown-item">Sin notificaciones</li>`);
                else
                    res.forEach((not)=>{
                        $("#notifications").append(`<li class="dropdown-item">${not.title}</li>`);
                    })
            }
        })
    }
})