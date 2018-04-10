var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

// var Hello=c({
//     render:function(){
//         return e("div",null,"Hello World");
//     }
// });

var make_store=function(get){
    var data={};

    if(typeof get=="function"){
        get(function(res){
            data=res;

            for(var i=0;i<subscribers.length;i++){
                subscribers[i](data);
            }
        });
    }

    var subscribers=[];

    return{
        subscribe:function(callback){
            if(typeof callback=="function"){
                subscribers.push(callback);
            }
        },
        fetch:function(){
            get(function(res){
                data=res;

                for(var i=0;i<subscribers.length;i++){
                    subscribers[i](data);
                }
            });
        }
    }
}

var appt_types_store=make_store(function(callback){
    $.post(
        ajax_object.ajax_url,{
            "action":"get_appt_types",
        },
        function(res){
            callback(res);
        }
    );
});

var User=c({
    render: function(){
        return e("div",null,null)
    }
});

var ApptProviderList=c({
    componentWillMount:function(){
        this.setState({
            "appt_providers":[],
        });

        var that=this;
        $.post(
            ajax_object.ajax_url,{
                "action":"get_appt_providers",
                "appt_type_id":that.props.appt_type_id
            },
            function(res){
                that.setState({
                    "appt_providers":res,
                });
            }
        );
    },
    render:function(){
        var that=this;

        return e.apply(that,["div",{"className":"appt_type_providers_container"}].concat((function(){
            var c=[];

            for(let i=0;i<that.state.appt_providers.length;i++){(function(appt_provider){
                c.push(
                    e("div",{"className":"appt_type_provider_info_container"},
                        e("img",{"className":"appt_type_provider_icon"},null),
                        e("div",{"className":"appt_type_provider_location"},appt_provider.location),
                        e("div",{"className":"appt_type_provider_phone"},appt_provider.phone)
                    )
                );
            })(that.state.appt_providers[i][0])}

            return c;
        })()))
    }
});

var ApptList=c({
    componentWillMount:function(){

        this.setState({
            "appt_types":[],
            "appt_providers":[],
            "selected":false
        });

        var that=this;
        appt_types_store.subscribe(function(data){
            that.setState({"appt_types":data});
        });
    },
    select_appt_type:function(id){
        this.setState({
            "selected":id
        });
    },
    render:function(){
        var that=this;

        return e.apply(that,["div",null].concat((function(){
            var c=[];

            for(let i=0;i<that.state.appt_types.length;i++){(function(appt_type){
                c.push(
                    e(
                        "div",
                        {
                            "className":"appt_type_container",
                            "onClick":function(){
                                that.select_appt_type(appt_type.id)
                            }
                        },
                        e(
                            "div",
                            {"className":"appt_type_info_container"},
                            e("img",{"className":"appt_type_icon"},null),
                            e("div",{"className":"appt_type_title"},appt_type.title),
                            e("div",{"className":"appt_type_description"},appt_type.description)
                        ),
                        (function(){
                            if(that.state.selected==appt_type.id){
                                return e(ApptProviderList,{"appt_type_id":appt_type.id},null)
                            }else{
                                return e("div",null,null)
                            }
                        })()
                    )
                );
            })(that.state.appt_types[i])}

            return c;
        })()));
    }
});

var NewAppt=c({
    render: function(){
        return e("div",null,
            e("h2",null,"Make an Appointment"),
            e(ApptList,null,null)
        )
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