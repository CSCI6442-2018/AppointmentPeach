var $=jQuery;

function to_update() {
    var title = document.getElementById("customer_title").value;
    $.post(
        ajaxurl,{
            "action":"ap_overview_update_customer_title",
            'title': title
        },
        function(res){
            alert(res.message);
            window.location.reload();
        }
    );
}