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
                "action":"ap_customer_get_appts_info"
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
                    e("th",null,"Type"),
                    e("th",null,"Provider"),
                    e("th",null,"Provider Email"),
                    e("th",null,"Provider Phone"),
                    e("th",null,"Provider Location"),
                    e("th",null,"Date"),
                    e("th",null,"Time"),
                    e("th",null,"Status")
                )
            );
            for(var i=0;i<that.state.appts.length;i++){(function(appt){
                children.push(
                    e("tr",null,
                        e("td",null,appt.appt_type_title),
                        e("td",null,appt.provider_name),
                        e("td",null,appt.provider_email),
                        e("td",null,appt.provider_phone),
                        e("td",null,appt.provider_location),
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
                        })())
                    )
                )
            })(that.state.appts[i])}
            return children;
        })()))
    }
});

var App=c({
    render:function(){
        return e("div",null,
            e("h1",null,"Appointments"),
            e(ApptList,null,null)
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("ap_customer")
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