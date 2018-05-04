function dialog_box(render,size){
    var dialog_box=jQuery("<div>").attr({"class":"dialog_box"});

    if(size==="large"||size==="lg"){
        dialog_box.addClass("dialog_box_lg");
    }else if(size==="small"||size==="sm"){
        dialog_box.addClass("dialog_box_sm");
    }else if(size==="middle"||size==="md"){
        dialog_box.addClass("dialog_box_md");
    }else{
        dialog_box.addClass("dialog_box_md");
    }

    var dialog_box_container=jQuery("<div>");
    var dialog_shut_btn=jQuery("<div>").attr({"class":"dialog_shut_btn"}).html("X");

    dialog_box
        .append(dialog_box_container)
        .append(dialog_shut_btn);

    var dialog_box_mask=jQuery("<div>").attr({"class":"dialog_box_mask"});

    var shut=function(){
        dialog_box_mask.remove();
    }

    dialog_shut_btn.click(shut);

    var dialog={
        shut:shut
    }

    jQuery(document.body).append(dialog_box_mask.append(dialog_box));
    if(typeof render==="function"){
        render(dialog_box_container[0],dialog);
    }
}