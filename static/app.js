$(document).ready(function(){
    var data={
        'action': 'ajax_test',
        'dt': Math.floor(Math.random()*(20-10+1))+10
    };

    console.log(data.dt);

    $.post(ajax_object.ajax_url,data,function(response){
        console.log(response);
    });
});