var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

// var Hello=c({
//     render:function(){
//         return e("div",null,"Hello World");
//     }
// });

var ApptTimeSelecter=c({
    render:function(){
        var that=this;

        return e.apply(that,["div",null].concat((function(){
            var c=[];

            //c.push(e("h3",null,"Appointment Time"));

            return c;
        })()))
    }
})

var ApptProvidersList=c({
    render:function(){
        var that=this;

        return e.apply(that,["div",null].concat((function(){
            var c=[];

            //c.push(e("h3",null,"Appointment Providers"));

            for(let i=0;i<that.props.appt_providers.length;i++){(function(appt_provider){
                c.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_provider_container",
                            "onClick":function(){
                                that.props.onSelect(
                                    that.props.selected_type,
                                    appt_provider.user_id
                                );
                            }
                        },
                        e("img",{"className":"appt_type_provider_icon"},null),
                        e("div",{"className":"appt_type_provider_location"},appt_provider.location),
                        e("div",{"className":"appt_type_provider_phone"},appt_provider.phone)
                    )
                );
            })(that.props.appt_providers[i][0])}

            return c;
        })()))
    }
});

var ApptTypesList=c({
    render:function(){
        var that=this;

        return e.apply(that,["div",null].concat((function(){
            var c=[];

            //c.push(e("h3",null,"Appointment Types"))

            for(let i=0;i<that.props.appt_types.length;i++){(function(appt_type){
                c.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_container",
                            "onClick":function(){
                                that.props.onSelect(appt_type.id);
                            }
                        },
                        e("img",{"className":"appt_type_icon"},null),
                        e("div",{"className":"appt_type_title"},appt_type.title),
                        e("div",{"className":"appt_type_description"},appt_type.description)
                    )
                );
            })(that.props.appt_types[i])}

            return c;
        })()));
    }
});

var NewAppt=c({
    componentWillMount:function(){
        this.setState({
            "appt_types":[],
            "appt_providers":[],
            "appt_time":[],
            "selected_type":false,
            "selected_provider":false,
            "selected_time":false,
            "current_step":1
        });

        this.load_types();
    },
    load_types:function(){
        var that=this;

        this.setState({
            "selected_type":false,
            "selected_provider":false,
            "selected_time":false
        });

        $.post(
            ajax_object.ajax_url,{
                "action":"get_appt_types"
            },
            function(res){
                that.setState({
                    "appt_types":res,
                    "appt_providers":[],
                    "appt_time":[],
                    "current_step":1
                });
            }
        );
    },
    load_providers:function(appt_type_id){
        var that=this;

        this.setState({
            "selected_type":appt_type_id,
            "selected_provider":false,
            "selected_time":false
        });
        
        $.post(
            ajax_object.ajax_url,{
                "action":"get_appt_providers",
                "appt_type_id":appt_type_id
            },
            function(res){
                that.setState({
                    "appt_providers":res,
                    "appt_time":[],
                    "current_step":2
                });
            }
        );
    },
    load_time:function(appt_type_id,appt_provider_id){
        var that=this;

        this.setState({
            "selected_type":appt_type_id,
            "selected_provider":appt_provider_id,
            "selected_time":false
        })

        //TODO

        that.setState({
            "appt_time":[],
            "current_step":3
        });
    },
    submit:function(){

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
                                that.load_providers(that.state.selected_type);
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
                                that.load_time();
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
                            
                            "appt_types":this.state.appt_types,
                            "onSelect":this.load_providers
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
                            "appt_providers":this.state.appt_providers,
                            "selected_type":this.state.selected_type,
                            "onSelect":this.load_time
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
                            "appt_time":this.state.appt_time,
                            "onSelect":this.submit
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