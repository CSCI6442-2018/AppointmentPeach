var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

var NewApptTypeDialog=c({
    componentWillMount:function(){
        this.setState({
            "title":"",
            "description":"",
            "duration":1,
            'icon': ''
        })
    },
    upload_image: function(e) {
        var that = this;
        e.preventDefault();
        var image = wp.media({
            title: 'Upload Icon',
            multiple: false
        }).open()
            .on('select', function(e){
                var uploaded_image = image.state().get('selection').first();
                console.log(uploaded_image);
                var image_url = uploaded_image.toJSON().url;
                that.setState({
                    'icon': image_url
                });
                $('#icon').attr('src', image_url);
            });
    },
    submit:function(){
        var that=this;
        if(!(typeof that.state.title=="string" && that.state.title.length>0)){alert("Please input title");return;}
        if(!(typeof that.state.description=="string" && that.state.description.length>0)){alert("Please input description");return;}

        $.post(
            ajaxurl,{
                "action":"ap_appointment_types_menu_add_appt_type",
                "title":that.state.title,
                "description":that.state.description,
                "duration":that.state.duration,
                'icon': that.state.icon
            },
            function(res){
                that.props.dialog.shut();
                reload();
            }
        );
    },
    render:function(){
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"New Appointment Type"),
            e("div",null,
                e("div",null,
                    e("span",null,"Title"),
                    e("input",{
                        "className":"new_appt_type_dialog_input",
                        "value":that.state.title,
                        "onChange":function(event){
                            that.setState({
                                "title": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"Icon"),
                    e('div', {'className': 'new_appt_type_dialog_icon_row'},
                        e('img', {'className':'', 'src': that.state.icon, 'id': 'icon', 'height':70}, null)),
                    e('button', {'className': 'button-primary', 'id': 'upload-btn', 'onClick': that.upload_image}, 'Upload')
                ),
                e("div",null,
                    e("span",null,"Description"),
                    e("textarea",{
                        "className":"new_appt_type_dialog_textarea",
                        "value":that.state.description,
                        "onChange":function(event){
                            that.setState({
                                "description": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"Duration"),
                    e("input",{
                        "className":"new_appt_type_dialog_input",
                        "type":"number",
                        "value":that.state.duration,
                        "onChange":function(event){
                            var d=event.target.value;
                            if(d>0){
                                that.setState({
                                    "duration": event.target.value
                                })
                            }
                        }
                    },null)
                ),
            ),
            e("hr",null,null),
            e(
                "button",
                {"onClick":function(){
                    that.submit();
                }},
                "Submit"
            )
        );
    }
});

var EditApptTypeDialog=c({
    componentWillMount:function(){
        this.setState({
            "title":this.props.appt_type.title,
            "description":this.props.appt_type.description,
            "duration":this.props.appt_type.duration,
            'icon': this.props.appt_type.icon
        })
    },
    upload_image: function(e) {
        var that = this;
        e.preventDefault();
        var image = wp.media({
            title: 'Upload Icon',
            multiple: false
        }).open()
            .on('select', function(e){
                var uploaded_image = image.state().get('selection').first();
                console.log(uploaded_image);
                var image_url = uploaded_image.toJSON().url;
                that.setState({
                    'icon': image_url
                });
                $('#icon').attr('src', image_url);
            });
    },
    submit:function(){
        var that=this;
        if(!(typeof that.state.title=="string" && that.state.title.length>0)){alert("Please input title");return;}
        if(!(typeof that.state.description=="string" && that.state.description.length>0)){alert("Please input description");return;}

        $.post(
            ajaxurl,{
                "action":"ap_appointment_types_menu_edit_appt_type",
                "appt_type_id":that.props.appt_type.appt_type_id,
                "title":that.state.title,
                "description":that.state.description,
                "duration":that.state.duration,
                'icon': that.state.icon
            },
            function(res){
                console.log(res)
                that.props.dialog.shut();
                reload();
            }
        );
    },
    render:function(){
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Edit Appointment Type ID: "+that.props.appt_type.appt_type_id),
            e("div",null,
                e("div",null,
                    e("span",null,"Title"),
                    e("input",{
                        "className":"edit_appt_type_dialog_input",
                        "value":that.state.title,
                        "onChange":function(event){
                            that.setState({
                                "title": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"Icon"),
                    e('div', {'className': 'new_appt_type_dialog_icon_row'},
                        e('img', {'className':'', 'src': that.state.icon, 'id': 'icon', 'height':70}, null)),
        e('button', {'className': 'button-primary', 'id': 'upload-btn', 'onClick': that.upload_image}, 'Upload')
                ),
                e("div",null,
                    e("span",null,"Description"),
                    e("textarea",{
                        "className":"edit_appt_type_dialog_textarea",
                        "value":that.state.description,
                        "onChange":function(event){
                            that.setState({
                                "description": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"Duration (X"+settings.granularity+"min)"),
                    e("input",{
                        "className":"edit_appt_type_dialog_input",
                        "type":"number",
                        "value":that.state.duration,
                        "onChange":function(event){
                            var d=event.target.value;
                            if(d>0){
                                that.setState({
                                    "duration": event.target.value
                                })
                            }
                        }
                    },null)
                ),
            ),
            e("hr",null,null),
            e(
                "button",
                {"onClick":function(){
                    that.submit();
                }},
                "Submit"
            )
        );
    }
});

var ApptTypeList=c({
    componentWillMount:function(){
        this.setState({
            appt_types:[]
        });
        this.load_appt_types();

        var that=this;
        relaod_subscribers.push(function(){
            that.load_appt_types();
        })
    },
    load_appt_types:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_appointment_types_menu_get_appt_types"
            },
            function(res){
                that.setState({
                    "appt_types":res
                });
            }
        );
    },
    deactivate_appt_type:function(appt_type){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_appointment_types_menu_deactivate_appt_type",
                "appt_type_id":appt_type.appt_type_id
            },
            function(res){
                reload();
            }
        );
    },
    activate_appt_type:function(appt_type){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_appointment_types_menu_activate_appt_type",
                "appt_type_id":appt_type.appt_type_id
            },
            function(res){
                reload();
            }
        );
    },
    edit_appt_type:function(appt_type){
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(EditApptTypeDialog,{
                    "appt_type":appt_type,
                    "dialog":dialog
                },null),
                container
            );
        },"md");
    },
    render:function(){
        var that=this;
        return e.apply(that,["table",{"className":"appt_types_list"}].concat((function(){
            var children=[];
            children.push(
                e("tr",null,
                    e("th",null,"ID"),
                    e("th",null,"Title"),
                    e("th",null,"Icon"),
                    e("th",null,"Description"),
                    e("th",null,"Duration"),
                    e("th",null,""),
                    e("th",null,"")
                )
            );
            for(var i=0;i<that.state.appt_types.length;i++){(function(appt_type){
                if(appt_type.active==0){
                    children.push(
                        e("tr",{"className":"appt_types_list_tr_inactive"},
                            e("td",null,appt_type.appt_type_id),
                            e("td",null,appt_type.title),
                            e("td",null, e('a', {href: appt_type.icon, 'target':'_blank'}, 'icon')),
                            e("td",null,appt_type.description),
                            e("td",null,(appt_type.duration*1*settings.granularity+"min")),
                            e("td",null,""),
                            e("td",null,
                                e("button",{"onClick":function(){that.activate_appt_type(appt_type)}},"Activate")
                            )
                        )
                    )
                }else{
                    children.push(
                        e("tr",{"className":"appt_types_list_tr_active"},
                            e("td",null,appt_type.appt_type_id),
                            e("td",null,appt_type.title),
                            e("td",null, e('a', {href: appt_type.icon, 'target':'_blank'}, 'icon')),
                            e("td",null,appt_type.description),
                            e("td",null,(appt_type.duration*1*settings.granularity+"min")),
                            e("td",null,
                                e("button",{"onClick":function(){that.edit_appt_type(appt_type)}},"Edit")
                            ),
                            e("td",null,
                                e("button",{"onClick":function(){that.deactivate_appt_type(appt_type)}},"Deactivate")
                            )
                        )
                    )
                }
            })(that.state.appt_types[i])}
            return children;
        })()))
    }
});

var App=c({
    render:function(){
        return e("div",null,
            e("h1",null,"Appointment Type Management"),
            e(ApptTypeList,null,null),
            e("button",{onClick:function(){
                dialog_box(function(container,dialog){
                    ReactDOM.render(
                        e(NewApptTypeDialog,{
                            "dialog":dialog
                        },null),
                        container
                    );
                },"md");
            }},"New Appointment Type")
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap_appointment_types_menu")
    );
});

var relaod_subscribers=[];
function reload(){
    for(let i=0;i<relaod_subscribers.length;i++){
        if(typeof relaod_subscribers[i]==="function"){
            relaod_subscribers[i]();
        }
    }
}