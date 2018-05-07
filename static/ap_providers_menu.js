var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

var ProviderNewApptTypesDialog=c({
    componentWillMount:function(){
        this.setState({
            appt_types:[],
            selected_appt_type:false
        });
        this.load_appt_types();
    },
    load_appt_types:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_get_appt_types"
            },
            function(res){
                that.setState({
                    "appt_types":res
                });
            }
        );
    },
    select:function(){
        var appt_type=event.target.value;
        this.setState({"selected_appt_type":appt_type});
    },
    submit:function(){
        if(!this.state.selected_appt_type){alert("Please select an appointment type");return;}

        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_add_new_type_to_provider",
                "provider_id":that.props.provider_id,
                "appt_type_id":that.state.selected_appt_type
            },
            function(res){
                that.props.dialog.shut();
                reload();
            }
        );
    },
    render:function(){
        console.log(this.state);
        var that=this;
        return e("div",null,
            e("h3",null,"Select an appointment type"),
            e.apply(that,["select",{"onChange":this.select,"value":this.state.selected_appt_type}].concat((function(){
                var children=[];
                children.push(
                    e("option",{"disabled":true,"selected":true,"hidden":true,"value":false},"Please select an appointment type")
                )
                for(var i=0;i<that.state.appt_types.length;i++){(function(appt_type){
                    var exist=false;
                    for(var j=0;j<that.props.provider_appt_types.length;j++){
                        if(that.props.provider_appt_types[j].appt_type_id==appt_type.appt_type_id){
                            exist=true;
                            break;
                        }
                    }
                    if(!exist){
                        children.push(
                            e("option",{"value":appt_type.appt_type_id},appt_type.title)
                        )
                    }
                })(that.state.appt_types[i])}
                return children;
            })())),
            e("hr",null,null),
            e("button",{"onClick":this.submit},"Submit")
        );
    }
});

var ProviderApptTypesDialog=c({
    componentWillMount:function(){
        this.setState({
            appt_types:[]
        });
        this.load_appt_types();
    },
    load_appt_types:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_get_types_by_provider",
                "provider_id":that.props.provider.user_id
            },
            function(res){
                that.setState({
                    "appt_types":res
                });
            }
        );
    },
    remove_appt_type:function(appt_type_id){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_delete_provider_appt_type",
                "provider_id":that.props.provider.user_id,
                "appt_type_id":appt_type_id,
            },
            function(res){
                that.props.dialog.shut();
                reload();
            }
        );
    },
    new_appt_type:function(provider_id){
        var that=this;
        this.props.dialog.shut();
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(ProviderNewApptTypesDialog,{
                    "provider_id":provider_id,
                    "provider_appt_types":that.state.appt_types,
                    "dialog":dialog
                },null),
                container
            );
        },"sm");
    },
    render:function(){
        console.log(this.state);
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Appointment Types of "+that.props.provider.name),
            e.apply(that,["table",null].concat((function(){
                var children=[];
                children.push(
                    e("tr",null,
                        e("th",null,"ID"),
                        e("th",null,"Title"),
                        e("th",null,"")
                    )
                );
                for(var i=0;i<that.state.appt_types.length;i++){(function(appt_type){
                    if(appt_type.active==0){
                        children.push(
                            e("tr",{"className":"provider_appt_type_list_tr_inactive"},
                                e("td",null,appt_type.appt_type_id),
                                e("td",null,appt_type.title),
                                e("td",null,"")
                            )
                        )
                    }else{
                        children.push(
                            e("tr",{"className":"provider_appt_type_list_tr_active"},
                                e("td",null,appt_type.appt_type_id),
                                e("td",null,appt_type.title),
                                e("td",null,
                                    e("button",{"onClick":function(){that.remove_appt_type(appt_type.appt_type_id)}},"Remove")
                                ),
                            )
                        )
                    }
                })(that.state.appt_types[i])}
                return children;
            })())),
            e("hr",null,null),
            e(
                "button",
                {"onClick":function(){
                    that.new_appt_type(that.props.provider.user_id);
                }},
                "New appointment type"
            )
        );
    }
});

var EditProiderDialog=c({
    componentWillMount:function(){
        this.setState({
            "name":this.props.provider.name,
            "location":this.props.provider.location,
            "phone":this.props.provider.phone,
            "email":this.props.provider.email,
        })
    },
    submit:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_edit_provider",
                "provider_id":that.props.provider.user_id,
                "name":that.state.name,
                "location":that.state.location,
                "phone":that.state.phone,
                "email":that.state.email,
            },
            function(res){
                that.props.dialog.shut();
                reload();
            }
        );
    },
    render:function(){
        console.log(this.state);
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Edit Provider ID: "+this.props.provider.user_id),
            e("div",null,
                e("div",null,
                    e("span",null,"Name"),
                    e("input",{
                        "className":"edit_provider_dialog_input",
                        "value":this.state.name,
                        "onChange":function(event){
                            that.setState({
                                "name": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"Location"),
                    e.apply(that,["select",{
                        "className":"edit_provider_dialog_select",
                        "value":that.state.location,
                        "onChange":function(event){
                            that.setState({
                                "location": event.target.value
                            })
                        }
                    }].concat((function(){
                        var children=[];
                        for(var i=0;i<locations.length;i++){(function(location){
                            children.push(
                                e("option",{"value":location.name},location.name)
                            )
                        })(locations[i])}
                        return children;
                    })()))
                ),
                e("div",null,
                    e("span",null,"Phone"),
                    e("input",{
                        "className":"edit_provider_dialog_input",
                        "value":this.state.phone,
                        "onChange":function(event){
                            that.setState({
                                "phone": event.target.value
                            })
                        }
                    },null)
                ),
                e("div",null,
                    e("span",null,"E-mail"),
                    e("input",{
                        "className":"edit_provider_dialog_input",
                        "value":this.state.email,
                        "onChange":function(event){
                            that.setState({
                                "email": event.target.value
                            })
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

var ProviderList=c({
    componentWillMount:function(){
        this.setState({
            providers:[]
        });
        this.load_providers();

        var that=this;
        relaod_subscribers.push(function(){
            that.load_providers();
        })
    },
    load_providers:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_get_providers"
            },
            function(res){
                that.setState({
                    "providers":res
                });
            }
        );
    },
    view_appt_types_of_provider:function(provider){
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(ProviderApptTypesDialog,{
                    "provider":provider,
                    "dialog":dialog
                },null),
                container
            );
        },"md");
    },
    view_time_slots_of_provider:function(provider){
    },
    activate_provider:function(provider){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_activate_provider",
                "provider_id":provider.user_id
            },
            function(res){
                reload();
            }
        );
    },
    deactivate_provider:function(provider){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_deactivate_provider",
                "provider_id":provider.user_id
            },
            function(res){
                reload();
            }
        );
    },
    eidt_provider:function(provider){
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(EditProiderDialog,{
                    "provider":provider,
                    "dialog":dialog
                },null),
                container
            );
        },"md");
    },
    render:function(){
        console.log(this.state);
        var that=this;
        return e.apply(that,["table",{"className":"providers_list"}].concat((function(){
            var children=[];
            children.push(
                e("tr",null,
                    e("th",null,"ID"),
                    e("th",null,"Name"),
                    e("th",null,"Location"),
                    e("th",null,"Phone"),
                    e("th",null,"Email"),
                    e("th",null,""),
                    e("th",null,""),
                    e("th",null,""),
                    e("th",null,"")
                )
            );
            for(var i=0;i<that.state.providers.length;i++){(function(provider){
                if(provider.active==0){
                    children.push(
                        e("tr",{"className":"providers_list_tr_inactive"},
                            e("td",null,provider.user_id),
                            e("td",null,provider.name),
                            e("td",null,provider.location),
                            e("td",null,provider.phone),
                            e("td",null,provider.email),
                            e("td",null,""),
                            e("td",null,""),
                            e("td",null,""),
                            e("td",null,
                                e("button",{"onClick":function(){that.activate_provider(provider)}},"Activate")
                            )
                        )
                    )
                }else{
                    children.push(
                        e("tr",{"className":"providers_list_tr_active"},
                            e("td",null,provider.user_id),
                            e("td",null,provider.name),
                            e("td",null,provider.location),
                            e("td",null,provider.phone),
                            e("td",null,provider.email),
                            e("td",null,
                                e("button",{"onClick":function(){that.view_appt_types_of_provider(provider)}},"Appointment types")
                            ),
                            e("td",null,
                                e("button",{"onClick":function(){that.view_time_slots_of_provider(provider)}},"Time slots")
                            ),
                            e("td",null,
                                e("button",{"onClick":function(){that.eidt_provider(provider)}},"Edit infomation")
                            ),
                            e("td",null,
                                e("button",{"onClick":function(){that.deactivate_provider(provider)}},"Deactivate")
                            )
                        )
                    )
                }
            })(that.state.providers[i])}
            return children;
        })()))
    }
})

var App=c({
    render:function(){
        return e("div",null,
            e("h1",null,"Providers Menu"),
            e(ProviderList,null,null)
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap_providers_menu")
    );
});

var relaod_subscribers=[];
function reload(){
    for(let i=0;i<relaod_subscribers.length;i++){
        if(typeof relaod_subscribers[i]=="function"){
            relaod_subscribers[i]();
        }
    }
}