var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

// var Hello=c({
//     render:function(){
//         return e("div",null,"Hello World");
//     }
// });

var ApptProvidersList=c({
    render:function(){
        var that=this;

        return e.apply(that,["div",null].concat((function(){
            var c=[];

            c.push(e("h3",null,"Appointment Providers"));

            for(let i=0;i<that.props.appt_providers.length;i++){(function(appt_provider){
                c.push(
                    e("div",{"className":"appt_type_provider_container"},
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

            c.push(e("h3",null,"Appointment Types"))

            for(let i=0;i<that.props.appt_types.length;i++){(function(appt_type){
                c.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_container",
                            "onClick":function(){
                                that.props.NewAppt.load_providers(appt_type.id)
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
        });

        this.load_appt_types();
    },
    load_appt_types:function(){
        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"get_appt_types"
            },
            function(res){
                that.setState({"appt_types":res});
            }
        );
    },
    load_providers:function(appt_type_id){
        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"get_appt_providers",
                "appt_type_id":appt_type_id
            },
            function(res){
                that.setState({"appt_providers":res});
            }
        );
    },
    render: function(){
        return e("div",null,
            e("h2",null,"Make an Appointment"),
            e(
                ApptTypesList,
                {
                    "appt_types":this.state.appt_types,
                    "NewAppt":this
                },
                null
            ),
            e(
                ApptProvidersList,
                {
                    "appt_providers":this.state.appt_providers,
                    "NewAppt":this
                },
                null
            )
        )
    }
});

var App=c({
    render:function(){
        return e("div",null,
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