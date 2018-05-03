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
        return e.apply(that,["div",{"className":"appt_time_selecter"}].concat((function(){
            var children=[];
            for(var date in times_by_date){(function(date){
                children.push(
                    e("div",{"className":"appt_time_slot_date_container"},
                    e("div",{"className":"appt_time_slot_date_tag"},date),
                    e.apply(that,["div",{"className":"appt_time_slot_time_tag_container"}].concat((function(){
                        var children=[];
                        for(var i=0;i<times_by_date[date].length;i++){(function(time){
                            children.push(
                                e(
                                    "div",
                                    {
                                        "className":"appt_time_slot_time_tag",
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
                    })()))
                ));
            })(date)}
            return children;
        })()))
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
                            "onClick":function(){that.props.onSelect(appt_provider.user_id);}
                        },
                        e("img",{"className":"appt_type_provider_icon"},null),
                        e("div",{"className":"appt_type_provider_name"},appt_provider.name),
                        e("div",{"className":"appt_type_provider_location"},appt_provider.location),
                        e("div",{"className":"appt_type_provider_phone"},appt_provider.phone),
                        e("div",{"className":"appt_type_provider_email"},appt_provider.email)
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
        this.setState({
            "selected_date":date,
            "selected_time":time
        },function(){
            var that=this;
            console.log(that);
        });
    },
    render: function(){
        var that=this;
        console.log(this.state);
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
                    "Time"
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

var User=c({
    componentWillMount:function(){
        this.setState({
            "signed_in":false
        });
    },
    render:function(){
        console.log(this.state);
        if(this.state.signed_in){
            //
        }else{
            return e(
                "div",
                null,
                e("h2",null,"Hello"),
                e(
                    "p",null,
                    e("span",null,"To check or edit your appointments, please "),
                    e("span",{"className":"regiser_or_sign_in"},"register or sign in"),
                    e("span",null," here.")
                )
            )
        }
    }
});

var App=c({
    render:function(){
        return e("div",null,
            e(User,null,null),
            e(NewAppt,null,null)
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap")
    );
});