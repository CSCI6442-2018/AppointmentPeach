var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

function format_time(t){
    var h=Math.floor(t/60);
    var m=t%60;

    return(
        Math.floor(h/10).toString()+
        (h%10).toString()+
        ":"+
        Math.floor(m/10).toString()+
        (m%10).toString()
    )
}

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
                        if(that.props.provider_appt_types[j].appt_type_id===appt_type.appt_type_id){
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
                "provider_id":that.props.provider.ID
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
                "provider_id":that.props.provider.ID,
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
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Appointment Types of "+that.props.provider.user_nicename),
            e.apply(that,["table",{"className":"provider_appt_type_list"}].concat((function(){
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
                    that.new_appt_type(that.props.provider.ID);
                }},
                "New appointment type"
            )
        );
    }
});

var EditProviderDialog=c({
    componentWillMount:function(){
        this.setState({
            "name":this.props.provider.user_nicename,
            "location":this.props.provider.location,
            "phone":this.props.provider.phone,
            "email":this.props.provider.user_email,
        })
    },
    submit:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_edit_provider",
                "provider_id":that.props.provider.ID,
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
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Edit Provider ID: "+this.props.provider.ID),
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
                    e("input",{
                        "className":"edit_provider_dialog_input",
                        "value":this.state.location,
                        "onChange":function(event){
                            that.setState({
                                "location": event.target.value
                            })
                        }
                    },null)
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

var ProviderNewTimeSlotDialog=c({
    componentWillMount:function(){
        this.setState({
            "year":(new Date()).getUTCFullYear(),
            "month":(new Date()).getUTCMonth()+1,
            "day":(new Date()).getUTCDate(),
            "start":false,
            "end":false
        });
    },
    submit:function(){
        if(!this.state.year){alert("Please input year");return;}
        if(!this.state.month){alert("Please select month");return;}
        if(!this.state.day){alert("Please select day");return;}
        if(!this.state.start){alert("Please select start time");return;}
        if(!this.state.end){alert("Please select end time");return;}

        var that=this;
        var y=that.state.year*1;
        var m=that.state.month*1;
        var d=that.state.day*1;
        var s=that.state.start*1;
        var e=that.state.end*1;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_add_timeslot_to_provider",
                "provider_id":that.props.provider.ID,
                "date":(y)+"-"+(Math.floor(m/10).toString()+(m%10).toString())+"-"+(Math.floor(d/10).toString()+(d%10).toString()),
                "time":s,
                "length":(e-s)
            },
            function(res){
                if(res.code==0){
                    that.props.dialog.shut();
                    reload();
                }

                if(res.code==1){
                    alert("Time slot already exsited")
                }
            }
        );
    },
    render:function(){
        var that=this;
        return e("div",null,
            e("h2",null,"Assign New Time Slot for: "+this.props.provider.user_nicename),
            e("span",null,"Date"),
            e("div",null,
                e("input",{
                    "type":"number",
                    "value":this.state.year,
                    "onChange":function(event){
                        var y=event.target.value;
                        if(y>0){
                            that.setState({
                                "year": event.target.value,
                                "month": false,
                                "day":false
                            })
                        }
                    }
                },null),
                e("br",null,null),
                e("select",{
                    "value":that.state.month,
                    "onChange":function(event){
                        that.setState({
                            "month": event.target.value,
                            "day":false
                        })
                    }},
                    e("option",{"disabled":true,"selected":true,"hidden":true,"value":false},""),
                    e("option",{"value":1},"January"),
                    e("option",{"value":2},"February"),
                    e("option",{"value":3},"March"),
                    e("option",{"value":4},"April"),
                    e("option",{"value":5},"May"),
                    e("option",{"value":6},"June"),
                    e("option",{"value":7},"July"),
                    e("option",{"value":8},"August"),
                    e("option",{"value":9},"September"),
                    e("option",{"value":10},"October"),
                    e("option",{"value":11},"November"),
                    e("option",{"value":12},"December"),
                ),
                e.apply(that,["select",{
                    "value":that.state.day,
                    "disabled":!(that.state.year&&that.state.month),
                    "onChange":function(event){
                        that.setState({
                            "day": event.target.value
                        })
                    }
                }].concat((function(){
                    var children=[];
                    children.push(e("option",{"disabled":true,"selected":true,"hidden":true,"value":false},""));

                    var y=that.state.year*1;
                    var m=that.state.month*1;

                    var days=[0,31,28,31,30,31,30,31,31,30,31,30,31];
                    if((y%100===0&&y%400===0)||(y%100!==0&&y%4===0)){
                        days[2]=29;
                    }

                    for(var i=1;i<=days[m];i++){(function(i){
                        children.push(e("option",{"value":i},i));
                    })(i)}
                    return children;
                })())),
            ),
            e("span",null,"Time"),
            e("div",null,
                e.apply(that,["select",{
                    "value":that.state.start,
                    "onChange":function(event){
                        that.setState({
                            "start": event.target.value,
                            "end": false
                        })
                    }
                }].concat((function(){
                    var children=[];
                    children.push(e("option",{"disabled":true,"selected":true,"hidden":true,"value":false},""));

                    for(var i=0;i*settings.granularity<24*60;i++){(function(i){
                        children.push(e("option",{"value":i},format_time(i*settings.granularity)));
                    })(i)}
                    return children;
                })())),
                e("span",null,"-"),
                e.apply(that,["select",{
                    "value":that.state.end,
                    "disabled":!(that.state.start),
                    "onChange":function(event){
                        that.setState({
                            "end": event.target.value
                        })
                    }
                }].concat((function(){
                    var children=[];
                    children.push(e("option",{"disabled":true,"selected":true,"hidden":true,"value":false},""));

                    for(var i=(that.state.start*1)+1;i*settings.granularity<=24*60;i++){(function(i){
                        children.push(e("option",{"value":i},format_time(i*settings.granularity)));
                    })(i)}
                    return children;
                })())),
            ),
            e("hr",null,null),
            e("button",{"onClick":that.submit},"Submit"),
        )
    }
});

var ProviderTimeSlotsDialog=c({
    componentWillMount:function(){
        this.setState({
            "time_slots":[]
        });
        this.load_time_slots();
    },
    load_time_slots:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_get_provider_timeslot",
                "provider_id":that.props.provider.ID
            },
            function(res){
                that.setState({
                    "time_slots":res
                });
            }
        );
    },
    remove_time_slot:function(date,time){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_delete_provider_timeslot",
                "provider_id":that.props.provider.ID,
                "date":date,
                "time":time,
                "length":1
            },
            function(res){
                that.props.dialog.shut();
                reload();
            }
        );
    },
    new_time_slot:function(){
        var that=this;
        this.props.dialog.shut();
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(ProviderNewTimeSlotDialog,{
                    "provider":that.props.provider,
                    "dialog":dialog
                },null),
                container
            );
        },"sm");
    },
    render:function(){
        var that=this;

        var time_slots=that.state.time_slots;
        var time_slots_by_date=[];
        for(var i=0;i<time_slots.length;i++){
            var slot=time_slots[i];
            if(!time_slots_by_date[slot.date]){
                time_slots_by_date[slot.date]=[];
            }
            time_slots_by_date[slot.date].push(slot);
        }

        return e("div",null,
            e("h2",null,"Time Slots of: "+this.props.provider.user_nicename),
            e("hr",null,null),
            e("button",{"onClick":that.new_time_slot},"Assign new timeslot"),
            e.apply(that,["div",null].concat((function(){
                var children=[];
                for(var date in time_slots_by_date){
                    children.push(e("div",null,
                        e("hr",null,null),
                        e("span",null,date),
                        e.apply(that,["table",null].concat((function(){
                            var children=[];
                            for(var i=0;i<time_slots_by_date[date].length;i++){(function(time_slot){
                                if(time_slot.appt_id==null){
                                    children.push(
                                        e("tr",null,
                                            e("td",null,(function(){
                                                var s=(time_slot.time*1)*settings.granularity;
                                                var e=(time_slot.time*1+1)*settings.granularity;
                                                return format_time(s)+"-"+format_time(e);
                                            })()),
                                            e("td",null,
                                                e("button",{"onClick":function(){that.remove_time_slot(time_slot.date,time_slot.time)}},"Remove")
                                            )
                                        )
                                    )
                                }else{
                                    children.push(
                                        e("tr",null,
                                            e("td",null,(function(){
                                                var s=(time_slot.time*1)*settings.granularity;
                                                var e=(time_slot.time*1+1)*settings.granularity;
                                                return format_time(s)+"-"+format_time(e);
                                            })()),
                                            e("td",null,"Appointment ID: "+time_slot.appt_id)
                                        )
                                    )
                                }
                            })(time_slots_by_date[date][i])}
                            return children;
                        })()))
                    ))
                }
                return children;
            })()))
        );
    }
});

var ProviderList=c({
    componentWillMount:function(){
        this.setState({
            'providers' :[]
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
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(ProviderTimeSlotsDialog,{
                    "provider":provider,
                    "dialog":dialog
                },null),
                container
            );
        },"md");
    },
    activate_provider:function(provider){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_providers_menu_activate_provider",
                "provider_id":provider.ID
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
                "provider_id":provider.ID
            },
            function(res){
                reload();
            }
        );
    },
    edit_provider:function(provider){
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(EditProviderDialog,{
                    "provider":provider,
                    "dialog":dialog
                },null),
                container
            );
        },"md");
    },
    render:function(){
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
                children.push(
                    e("tr", provider.active ? {"className":"providers_list_tr_active"}:{"className":"providers_list_tr_inactive"},
                        e("td",null,provider.ID),
                        e("td",null,provider.user_nicename),
                        e("td",null,provider.location),
                        e("td",null,provider.phone),
                        e("td",null,provider.user_email),
                        e("td",null,
                            provider.active
                                ?  e("button",{"onClick":function(){that.view_appt_types_of_provider(provider)}},"Appointment Types")
                                : ''),
                        e("td",null,
                            provider.active
                                ? e("button",{"onClick":function(){that.view_time_slots_of_provider(provider)}},"Time Slots")
                                : ''),
                        e("td",null,
                            provider.active
                                ? e("button",{"onClick":function(){that.edit_provider(provider)}},"Edit Information")
                                : ''),
                        e("td",null,
                            provider.active
                                ? e("button",{"onClick":function(){that.deactivate_provider(provider)}},"Deactivate")
                                : e("button",{"onClick":function(){that.activate_provider(provider)}},"Activate")
                        )
                    )
                )
            })(that.state.providers[i])}
            return children;
        })()))
    }
})

var App=c({
    render:function(){
        return e("div",null,
            e("h1",null,"Providers Management"),
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
        if(typeof relaod_subscribers[i]==="function"){
            relaod_subscribers[i]();
        }
    }
}