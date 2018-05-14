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

$(function($){
    $('#upload-btn').click(function(e) {
        e.preventDefault();
        var image = wp.media({
            title: 'Upload Icon',
            // mutiple: true if you want to upload multiple files at once
            multiple: false
        }).open()
            .on('select', function(e){
                // This will return the selected image from the Media Uploader, the result is an object
                var uploaded_image = image.state().get('selection').first();
                // We convert uploaded_image to a JSON object to make accessing it easier
                // Output to the console uploaded_image
                console.log(uploaded_image);
                var image_url = uploaded_image.toJSON().url;
                // update icon url via ajax
                $.post(
                    ajaxurl,{
                        "action":"ap_overview_update_icon",
                        'url': image_url
                    },
                    function(res){
                        alert(res.message);
                        $('#icon').attr('src', image_url);
                    }
                );
            });
    });
});