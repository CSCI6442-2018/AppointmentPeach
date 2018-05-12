var $=jQuery;

function to_update(){
    var business_type = document.getElementById("business_type").value;
    var granularity = document.getElementById("granularity").value;
    $.post(
        ajaxurl, {
            'action': 'ap_setup',
            'business_type': business_type,
            'granularity': granularity
        },
        function (res) {
            alert(res.message);
            if (res.status) {
                window.location.href = res.href;
            }
        }
    );
}