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

var ApptTimeSelecter=c({
    componentWillMount:function(){
        this.setState({
            "current_date":false,
            "y":(new Date()).getFullYear(),
            "m":(new Date()).getMonth()+1,
        });
    },
    render:function(){
        var t_by_date=[];
        for(var i=0;i<this.props.time_slots.length;i++){
            var slot=this.props.time_slots[i];
            if(!t_by_date[slot.date]){
                t_by_date[slot.date]=[];
            }
            if(!slot.appt_id){
                t_by_date[slot.date].push(slot.time);
            }
        }
        
        var times_by_date=[];
        for(var date in t_by_date){
            var t=t_by_date[date];
    
            var times=[];
            for(var i=0;i<t.length;i++){
                var time=t[i];
                var a=true;
                for(var j=0;j<this.props.duration;j++){
                    var tm=((time*1)+(j*1)).toString();
                    if(t.indexOf(tm)<0){
                        a=false;
                        break;
                    }
                }
                if(a){
                    times.push(time);
                }
            }

            times_by_date[date]=times;
        }

        var that=this;
        return e("div",{"className":"appt_time_selecter"},
            e("div",null,
                e("div",
                    {
                        "className":"appt_time_selecter_tag "+((!this.state.current_date)?("active "):(""))+((this.state.current_date)?("clickable "):("")),
                        "onClick":function(){
                            that.setState({
                                "current_date":false
                            })
                        }
                    },
                "Date"),
                e("div",{"className":"appt_time_selecter_tag "+((this.state.current_date)?("active"):(""))},"Time")
            ),
            e("div",{"className":"appt_time_selecter_date "+((!this.state.current_date)?("active"):(""))},
                e("div",{"className":"appt_date_year_container"},
                    e("div",{"className":"appt_date_y"},that.state.y),
                    e("div",
                        {
                            "className":"appt_date_pre_y",
                            "onClick":function(){
                                that.setState({
                                    "y":that.state.y-1
                                })
                            }
                        },
                        "-"
                    ),
                    
                    e("div",
                        {
                            "className":"appt_date_next_y",
                            "onClick":function(){
                                that.setState({
                                    "y":that.state.y+1
                                })
                            }
                        },
                        "+"
                    )
                ),
                e("div",{"className":"appt_date_month_container"},
                    e("div",{"className":"appt_date_m"},[
                        "",
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ][that.state.m]),
                    e("div",
                        {
                            "className":"appt_date_pre_m",
                            "onClick":function(){
                                that.setState({
                                    "m":(that.state.m>1)?(that.state.m-1):(12)
                                })
                            }
                        },
                        "-"
                    ),
                    
                    e("div",
                        {
                            "className":"appt_date_next_m",
                            "onClick":function(){
                                that.setState({
                                    "m":(that.state.m-1+1)%12+1
                                })
                            }
                        },
                        "+"
                    )
                ),
                e.apply(that,["div",null].concat((function(){
                    var s=(new Date(that.state.y,that.state.m-1,1)).getDay();

                    var y=that.state.y;
                    var m=that.state.m;

                    var days=[0,31,28,31,30,31,30,31,31,30,31,30,31];
                    if((y%100===0&&y%400===0)||(y%100!==0&&y%4===0)){
                        days[2]=29;
                    }

                    var children=[];
                    var i=0;
                    var d=0;
                    for(;d<days[m];i++){
                        var disp=0;
                        if(i-s>=0){
                            d++;
                            disp=d;
                        }else{
                            disp=days[(m>1)?(m-1):(12)]+1+(i-s);
                        }

                        var date_str=(y)+"-"+(Math.floor(m/10).toString()+(m%10).toString())+"-"+(Math.floor(d/10).toString()+(d%10).toString());

                        children.push(
                            e(
                                "div",
                                {
                                    "className":"appt_date_d "+((d>0)?(""):("hide "))+((date_str in times_by_date)?("avaliable "):("")),
                                    "onClick":(function(date_str){
                                        return function(){
                                            if(date_str in times_by_date){
                                                that.setState({
                                                    "current_date":date_str
                                                })
                                            }
                                        }
                                    })(date_str)
                                },
                                disp
                            )
                        )
                    }
                    return children;
                })()))
            ),
            e("div",{"className":"appt_time_selecter_time "+((this.state.current_date)?("active"):(""))},
                e.apply(that,["div",null].concat((function(){
                    if(that.state.current_date){
                        var date=that.state.current_date;
                        var children=[];
                        for(var i=0;i<times_by_date[date].length;i++){(function(time){
                            children.push(
                                e(
                                    "div",
                                    {
                                        "className":"appt_time",
                                        "onClick":function(){that.props.onSelect(date,time);}
                                    },
                                    (function(){
                                        var s=(time*1)*settings.granularity;
                                        var e=(time*1+that.props.duration*1)*settings.granularity;
                                        return format_time(s)+"-"+format_time(e);
                                    })()
                                )
                            );
                        })(times_by_date[date][i])}
                        return children;
                    }else{
                        return e("div",null,null)
                    }
                })()))
            )
        )
    }
})

var ApptProvidersList=c({
    render:function(){
        var that=this;
        return e.apply(that,["div",{"className":"appt_providers_selecter"}].concat((function(){
            var children=[];

            for(var i=0;i<that.props.providers.length;i++){(function(appt_provider){
                children.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_provider_container",
                            "onClick":function(){that.props.onSelect(appt_provider.ID);}
                        },
                        e("img",{"className":"appt_type_provider_icon"},null),
                        e("div",{"className":"appt_type_provider_name"},appt_provider.user_nicename),
                        e("div",{"className":"appt_type_provider_location"},appt_provider.location),
                        e("div",{"className":"appt_type_provider_phone"},appt_provider.phone),
                        e("div",{"className":"appt_type_provider_email"},appt_provider.user_email)
                    )
                );
            })(that.props.providers[i])}

            return children;
        })()))
    }
});

var ApptTypesList=c({
    render:function(){
        var that=this;

        return e.apply(that,["div",{"className":"appt_types_selecter"}].concat((function(){
            var children=[];

            for(var i=0;i<that.props.types.length;i++){(function(appt_type){
                children.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_container",
                            "onClick":function(){that.props.onSelect(appt_type.appt_type_id);}
                        },
                        e("img",{"className":"appt_type_icon"},null),
                        e("div",{"className":"appt_type_title"},appt_type.title),
                        e("div",{"className":"appt_type_description"},appt_type.description)
                    )
                );
            })(that.props.types[i])}

            return children;
        })()));
    }
});

var ConfirmDialog=c({
    componentWillMount:function(){
        this.setState({
            "note":"",
        });
    },
    submit:function(){
        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"ap_app_new_appt",
                "appt_type":that.props.appt_type.appt_type_id,
                "provider":that.props.provider.ID,
                "date":that.props.date,
                "time":that.props.time
            },
            function(res){
                if(res.code==1){
                    alert("ERROR");
                }else{
                    alert("Successful made appointment.");
                    location.reload();
                }
            }
        );
    },
    render:function(){
        var that=this;
        return e("div",null,
            e("h2",null,"Confirm Your Appointment"),
            e("div",null,"Appointment"),
            e(
                "div",
                {"className":"confirm_appt_type_container",},
                e("img",{"className":"confirm_appt_type_icon"},null),
                e("div",{"className":"confirm_appt_type_title"},that.props.appt_type.title),
                e("div",{"className":"confirm_appt_date_time"},
                    e("span",null,that.props.date),
                    e("span",null,(function(){
                        var s=(that.props.time*1)*settings.granularity;
                        var e=(that.props.time*1+that.props.appt_type.duration*1)*settings.granularity;
                        return format_time(s)+"-"+format_time(e);
                    })())
                )
            ),
            e("div",null,"Provider"),
            e(
                "div",
                {"className":"confirm_appt_type_provider_container",},
                e("img",{"className":"confirm_appt_type_provider_icon"},null),
                e("div",{"className":"confirm_appt_type_provider_name"},that.props.provider.user_nicename),
                e("div",{"className":"confirm_appt_type_provider_location"},that.props.provider.location),
                e("div",{"className":"confirm_appt_type_provider_phone"},that.props.provider.phone),
                e("div",{"className":"confirm_appt_type_provider_email"},that.props.provider.user_email)
            ),
            e("div",null,"Your Note"),
            e("textarea",{
                "className":"confirm_note",
                "value":that.state.note,
                "onChange":function(event){
                    that.setState({
                        "note": event.target.value
                    })
                }
            },null),
            e("div",null,e("button",{"onClick":that.submit},"Confirm"))
        )
    }
});

var NewAppt=c({
    componentWillMount:function(){
        this.setState({
            "types":[],
            "providers":[],
            "time_slots":[],
            "selected_type":false,
            "selected_type_duration":false,
            "selected_provider":false,
            "selected_date":false,
            "selected_time":false,
            "current_step":1
        });

        this.load_types();
    },
    load_types:function(){
        var that=this;

        this.setState({
            "selected_type":false,
            "selected_type_duration":false,
            "selected_provider":false,
            "selected_date":false,
            "selected_time":false
        });

        $.post(
            ajax_object.ajax_url,{
                "action":"ap_app_get_appt_types"
            },
            function(res){
                that.setState({
                    "types":res,
                    "providers":[],
                    "time_slots":[],
                    "current_step":1
                });
            }
        );
    },
    select_type:function(appt_type_id){
        var that=this;
        this.setState({
            "selected_type":appt_type_id,
            "selected_type_duration":(function(){
                for(let i=0;i<that.state.types.length;i++){
                    if(that.state.types[i].appt_type_id==appt_type_id){
                        return that.state.types[i].duration;
                    }
                }
            })(),
            "selected_provider":false,
            "selected_date":false,
            "selected_time":false
        },function(){
            that.load_providers();
        });
    },
    load_providers:function(){
        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"ap_app_get_appt_providers",
                "appt_type_id":that.state.selected_type
            },
            function(res){
                that.setState({
                    "providers":res,
                    "time_slots":[],
                    "current_step":2
                });
            }
        );
    },
    select_provider:function(appt_provider_id){
        var that=this;
        this.setState({
            "selected_provider":appt_provider_id,
            "selected_date":false,
            "selected_time":false
        },function(){
            that.load_time_slots();
        });
    },
    load_time_slots:function(){
        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"ap_app_get_provider_time_slots",
                "appt_provider_id":that.state.selected_provider
            },
            function(res){
                that.setState({
                    "time_slots":res,
                    "current_step":3
                });
            }
        );
    },
    select_time:function(date,time){
        var that=this;
        this.setState({
            "selected_date":date,
            "selected_time":time
        },function(){
            dialog_box(function(container,dialog){
                ReactDOM.render(
                    e(ConfirmDialog,{
                        "appt_type":(function(){
                            for(var i=0;i<that.state.types.length;i++){
                                if(that.state.types[i].appt_type_id==that.state.selected_type){
                                    return that.state.types[i];
                                }
                            }
                        })(),
                        "provider":(function(){
                            for(var i=0;i<that.state.providers.length;i++){
                                if(that.state.providers[i].ID==that.state.selected_provider){
                                    return that.state.providers[i];
                                }
                            }
                        })(),
                        "date":that.state.selected_date,
                        "time":that.state.selected_time,
                        "dialog":dialog
                    },null),
                    container
                );
            },"md");
        });
    },
    render: function(){
        var that=this;
        return e("div",null,
            e("h2",null,"Make an Appointment"),
            e(
                "div",
                null,
                e(
                    "div",
                    {
                        "className":"new_appt_tag "+((this.state.current_step==1)?("active "):(""))+((this.state.current_step>=1)?("clickable "):("")),
                        "onClick":function(){
                            if(that.state.current_step>1){
                                that.load_types();
                            }
                        }
                    },
                    "Service"
                ),
                e(
                    "div",
                    {
                        "className":"new_appt_tag "+((this.state.current_step==2)?("active "):(""))+((this.state.current_step>=2)?("clickable "):("")),
                        "onClick":function(){
                            if(that.state.current_step>2){
                                that.setState({
                                    "selected_provider":false,
                                    "selected_date":false,
                                    "selected_time":false
                                },function(){
                                    that.load_providers();
                                });
                            }
                        }
                    },
                    "Provider"
                ),
                e(
                    "div",
                    {
                        "className":"new_appt_tag "+((this.state.current_step==3)?("active "):(""))+((this.state.current_step>=3)?("clickable "):("")),
                        "onClick":function(){
                            if(that.state.current_step>3){
                                this.setState({
                                    "selected_date":false,
                                    "selected_time":false
                                },function(){
                                    that.load_time_slots();
                                });
                            }
                        }
                    },
                    "Date & Time"
                )
            ),
            e(
                "div",
                null,
                e(
                    "div",
                    {"className":"new_appt_container "+((this.state.current_step==1)?("active"):(""))},
                    e(
                        ApptTypesList,
                        {

                            "types":this.state.types,
                            "onSelect":this.select_type
                        },
                        null
                    )
                ),
                e(
                    "div",
                    {"className":"new_appt_container "+((this.state.current_step==2)?("active"):(""))},
                    e(
                        ApptProvidersList,
                        {
                            "providers":this.state.providers,
                            "onSelect":this.select_provider
                        },
                        null
                    )
                ),
                e(
                    "div",
                    {"className":"new_appt_container "+((this.state.current_step==3)?("active"):(""))},
                    e(
                        ApptTimeSelecter,
                        {
                            "time_slots":this.state.time_slots,
                            "duration":this.state.selected_type_duration,
                            "onSelect":this.select_time
                        },
                        null
                    )
                )
            )
        )
    }
});

var App=c({
    render:function(){
        return e(NewAppt,null,null)
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap")
    );
});