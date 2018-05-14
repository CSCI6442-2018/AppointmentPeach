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
                "action":"ap_provider_get_appt_types",
            },
            function(res){
                that.setState({
                    "appt_types":res
                });
            }
        );
    },
    render:function(){
        var that=this;
        return e(
            "div",
            null,
            e.apply(that,["table",{"className":"appt_type_list"}].concat((function(){
                var children=[];
                children.push(
                    e("tr",null,
                        e("th",null,"ID"),
                        e("th",null,"Title"),
                        e("th",null,"Description"),
                        e("th",null,"Duration")
                    )
                );
                for(var i=0;i<that.state.appt_types.length;i++){(function(appt_type){
                    children.push(
                        e("tr",{"className":(appt_type.active==0)?("appt_type_list_tr_inactive"):("appt_type_list_tr_active")},
                            e("td",null,appt_type.appt_type_id),
                            e("td",null,appt_type.title),
                            e("td",null,appt_type.description),
                            e("td",null,(appt_type.duration*1*settings.granularity+"min"))
                        )
                    )
                })(that.state.appt_types[i])}
                return children;
            })()))
        );
    }
});

var NewTimeSlotDialog=c({
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
                "action":"ap_provider_add_timeslot",
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
            e("h2",null,"New Time Slot"),
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

var TimeSlotList=c({
    componentWillMount:function(){
        this.setState({
            "time_slots":[]
        });
        this.load_time_slots();

        var that=this;
        relaod_subscribers.push(function(){
            that.load_time_slots();
        })
    },
    load_time_slots:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_provider_get_timeslot",
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
                "action":"ap_provider_delete_timeslot",
                "date":date,
                "time":time,
                "length":1
            },
            function(res){
                reload();
            }
        );
    },
    new_time_slot:function(){
        var that=this;
        dialog_box(function(container,dialog){
            ReactDOM.render(
                e(NewTimeSlotDialog,{
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
            e("button",{"onClick":that.new_time_slot},"New timeslot"),
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

var ApptList=c({
    componentWillMount:function(){
        this.setState({
            appts:[]
        });
        this.load_appts();

        var that=this;
        relaod_subscribers.push(function(){
            that.load_appts();
        })
    },
    load_appts:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_provider_get_appts_info"
            },
            function(res){
                that.setState({
                    "appts":res
                });
            }
        );
    },
    render:function(){
        var that=this;
        return e.apply(that,["table",{"className":"appointment_list"}].concat((function(){
            var children=[];
            children.push(
                e("tr",null,
                    e("th",null,"ID"),
                    e("th",null,"Type"),
                    e("th",null,"Customer"),
                    e("th",null,"Note"),
                    e("th",null,"Date"),
                    e("th",null,"Time"),
                    e("th",null,"Status"),
                    e("th",null,"Request"),
                    e("th",null,"Request Note"),
                    e("th",null,""),
                    e("th",null,""),
                    e("th",null,"")
                )
            );
            for(var i=0;i<that.state.appts.length;i++){(function(appt){
                children.push(
                    e("tr",null,
                        e("td",null,appt.appt_id),
                        e("td",null,appt.appt_type_title),
                        e("td",null,appt.customer_name),
                        e("td",null,appt.note),
                        e("td",null,appt.date),
                        e("td",null,(function(){
                            var s=(appt.time*1)*settings.granularity;
                            var e=(appt.time*1+appt.appt_type_duration*1)*settings.granularity;
                            return format_time(s)+"-"+format_time(e);
                        })()),
                        e("td",null,(function(){
                            return {
                                "pending":"Pending",
                                "approved":"Approved",
                                "completed":"Completed"
                            }[appt.status]
                        })()),
                        e("td",null,appt.request),
                        e("td",null,appt.request_note),
                        e("td",null,
                            e("button",{"disabled":(appt.status!="pending"),"onClick":function(){
                                $.post(
                                    ajaxurl,{
                                        "action":"ap_provider_approve_appt",
                                        "appt_id":appt.appt_id
                                    },
                                    function(res){
                                        reload();
                                    }
                                );
                            }},"Approve")
                        ),
                        e("td",null,
                            e("button",{"disabled":(appt.status!="approved"),"onClick":function(){
                                $.post(
                                    ajaxurl,{
                                        "action":"ap_provider_complete_appt",
                                        "appt_id":appt.appt_id
                                    },
                                    function(res){
                                        reload();
                                    }
                                );
                            }},"Complete")
                        ),
                        e("td",null,
                            e("button",{"onClick":function(){
                                $.post(
                                    ajaxurl,{
                                        "action":"ap_provider_cancel_appt",
                                        "appt_id":appt.appt_id
                                    },
                                    function(res){
                                        reload();
                                    }
                                );
                            }},"Cancel")
                        ),
                    )
                )
            })(that.state.appts[i])}
            return children;
        })()))
    }
});

var EditProviderDialog=c({
    componentWillMount:function(){
        this.setState({
            "location":provider.location,
            "phone":provider.phone
        })
    },
    submit:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_provider_edit_info",
                "location":that.state.location,
                "phone":that.state.phone
            },
            function(res){
                location.reload();
            }
        );
    },
    render:function(){
        var that=this;
        return e(
            "div",
            null,
            e("h2",null,"Edit Infomation"),
            e("div",null,
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
                )
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

var ProvierInfo=c({
    render:function(){
        return e("div",null,
            e("p",null,"Name: "+this.props.provider.name),
            e("p",null,"Email: "+this.props.provider.email),
            e("p",null,"Location: "+this.props.provider.location),
            e("p",null,"Phone: "+this.props.provider.phone),
            e("div",null,e("button",{"onClick":function(){
                dialog_box(function(container,dialog){
                    ReactDOM.render(
                        e(EditProviderDialog,{
                            "dialog":dialog
                        },null),
                        container
                    );
                },"md");
            }},"Edit infomation"))
        );
    }
})

var App=c({
    render:function(){
        return e("div",{className: 'ap_menu_content'},
            e("h1",null,"Provider"),
            e("hr",null,null),
            e("h2",null,"Information"),
            e(ProvierInfo,{"provider":provider},null),
            e("hr",null,null),
            e("h2",null,"Appointment Types"),
            e(ApptTypeList,null,null),
            e("hr",null,null),
            e("h2",null,"Appointments"),
            e(ApptList,null,null),
            e("hr",null,null),
            e("h2",null,"Time Slots"),
            e(TimeSlotList,null,null)
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap_provider")
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