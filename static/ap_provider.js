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

var DatePicker = c({
    componentWillMount: function () {
        var dates = [];
        for (let i = 0; i < this.props.time_slots.length; i++) {
            if (dates.indexOf(this.props.time_slots[i].date) < 0) {
                dates.push(this.props.time_slots[i].date);
            }
        }

        this.setState({
            dates: dates,
            selected_date: (this.props.date) ? (this.props.date) : (false)
        });
    },
    select: function (event) {
        var date = event.target.value;
        this.setState({"selected_date": date});
    },
    submit: function () {
        this.props.callback(this.state.selected_date);
    },
    render: function () {
        var that = this;
        return e("div", null,
            e("h3", null, "Select a date"),
            e.apply(that, ["select", {"onChange": this.select, "value": this.state.selected_date}].concat((function () {
                var children = [];
                children.push(
                    e("option", {
                        "disabled": true,
                        "selected": true,
                        "hidden": true,
                        "value": false
                    }, "Please select a date")
                )
                for (var i = 0; i < that.state.dates.length; i++) {
                    (function (date) {
                        children.push(
                            e("option", {"value": date}, date)
                        )
                    })(that.state.dates[i])
                }
                return children;
            })())),
            e("hr", null, null),
            e("button", {className: 'button-primary',"onClick": this.submit}, "Submit")
        )
    }
});

var TimePicker = c({
    componentWillMount: function () {
        var t = [];
        for (var i = 0; i < this.props.time_slots.length; i++) {
            var slot = this.props.time_slots[i];
            if ((slot.date == this.props.date) && (!slot.appt_id)) {
                t.push(this.props.time_slots[i].time);
            }
        }

        var times = [];
        for (var i = 0; i < t.length; i++) {
            var time = t[i];
            var a = true;
            for (var j = 0; j < this.props.duration; j++) {
                var tm = ((time * 1) + (j * 1)).toString();
                if (t.indexOf(tm) < 0) {
                    a = false;
                    break;
                }
            }
            if (a) {
                times.push(time);
            }
        }

        this.setState({
            times: times,
            selected_time: (this.props.time) ? (this.props.time) : (false)
        });
    },
    select: function (event) {
        var start_time = event.target.value;
        this.setState({"selected_time": start_time});
    },
    submit: function () {
        this.props.callback(this.state.selected_time);
    },
    render: function () {
        var that = this;
        return e("div", null,
            e("h3", null, "Select a time"),
            e.apply(that, ["select", {"onChange": this.select, "value": this.state.selected_time}].concat((function () {
                var children = [];
                children.push(
                    e("option", {
                        "disabled": true,
                        "selected": true,
                        "hidden": true,
                        "value": false
                    }, "Please select a time")
                )

                if (that.props.time && that.state.times.indexOf(that.props.time) < 0) {
                    children.push(
                        e("option", {"value": that.props.time}, (function () {
                            var s = (that.props.time * 1) * settings.granularity;
                            var e = (that.props.time * 1 + that.props.duration * 1) * settings.granularity;
                            return format_time(s) + "-" + format_time(e);
                        })())
                    )
                }

                for (var i = 0; i < that.state.times.length; i++) {
                    (function (time) {
                        children.push(
                            e("option", {"value": time}, (function () {
                                var s = (time * 1) * settings.granularity;
                                var e = (time * 1 + that.props.duration * 1) * settings.granularity;
                                return format_time(s) + "-" + format_time(e);
                            })())
                        )
                    })(that.state.times[i])
                }
                return children;
            })())),
            e("hr", null, null),
            e("button", {className: 'button-primary',"onClick": this.submit}, "Submit")
        )
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
            e("button",{className: 'button-primary',"onClick":that.submit},"Submit"),
        )
    }
});

var TimeSlotList=c({
    componentWillMount:function(){
        this.setState({
            "ymd":false,
            "y":false,
            "m":false,
            "d":false
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
                "action":"ap_provider_get_time_slots",
            },
            function(res){

                var time_slots=res;
                var time_slots_by_date=[];
                for(var i=0;i<time_slots.length;i++){
                    var slot=time_slots[i];
                    if(!time_slots_by_date[slot.date]){
                        time_slots_by_date[slot.date]=[];
                    }
                    time_slots_by_date[slot.date].push(slot);
                }

                var ymd={};
                var y;
                var m;
                var d;
                for(var date in time_slots_by_date){
                    var parts=date.split('-');
                    y=parseInt(parts[0],10);
                    m=parseInt(parts[1],10);
                    d=parseInt(parts[2],10);

                    if(!ymd[y]){
                        ymd[y]={};
                    }

                    if(!ymd[y][m]){
                        ymd[y][m]={};
                    }

                    ymd[y][m][d]={
                        "slots":time_slots_by_date[date],
                        "date":date
                    };
                }

                that.setState({
                    "ymd":ymd,
                    "y":y,
                    "m":m,
                    "d":d
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

        var ymd=that.state.ymd;
        var y=that.state.y;
        var m=that.state.m;
        var d=that.state.d;

        return e("div",null,
            e("button",{className: 'button-primary',"onClick":that.new_time_slot},"New Working Date"),
            e("hr",null,null),
            e("div",null,
                e.apply(that,["select",{
                    "value":that.state.y,
                    "onChange":function(event){
                        var y=event.target.value;
                        var m;
                        var d;
                        for(var month in ymd[y]){
                            m=month;
                            for(var day in ymd[y][m]){
                                d=day;
                            }
                        }
                        that.setState({
                            "y": y,
                            "m": m,
                            "d": d
                        });
                    }
                }].concat((function(){
                    var children=[];
                    if(ymd){
                        for(var y in ymd){(function(y){
                            children.push(e("option",{"value":y},y));
                        })(y)}
                    }
                    return children;
                })())),
                e.apply(that,["select",{
                    "value":that.state.m,
                    "onChange":function(event){
                        var m=event.target.value;
                        var d;
                        for(var day in ymd[y][m]){
                            d=day;
                        }
                        that.setState({
                            "m": m,
                            "d": d
                        });
                    }
                }].concat((function(){
                    var children=[];
                    if(ymd){
                        for(var m in ymd[y]){(function(m){
                            children.push(e("option",{"value":m},[
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
                            ][parseInt(m,10)]));
                        })(m)}
                    }
                    return children;
                })())),
                e.apply(that,["select",{
                    "value":that.state.d,
                    "onChange":function(event){
                        that.setState({
                            "d": event.target.value
                        })
                    }
                }].concat((function(){
                    var children=[];
                    if(ymd){
                        for(var d in ymd[y][m]){(function(d){
                            children.push(e("option",{"value":d},d));
                        })(d)}
                        return children;
                    }
                })())),
            ),
            e("div",null,(ymd)?(ymd[y][m][d].date):(null)),
            e("div",null,
                e.apply(that,["table",{"className":"ap_provider_timeslot_list"}].concat((function(){
                    var children=[];
                    if(ymd){
                        var date=ymd[y][m][d].date;
                        var slots=ymd[y][m][d].slots;
                        for(var i=0;i<slots.length;i++){(function(slot){
                            if(slot.appt_id==null){
                                children.push(
                                    e("tr",null,
                                        e("td",null,(function(){
                                            var s=(slot.time*1)*settings.granularity;
                                            var e=(slot.time*1+1)*settings.granularity;
                                            return format_time(s)+"-"+format_time(e);
                                        })()),
                                        e("td",null,
                                            e("button",{className: 'button-secondary', "onClick":function(){that.remove_time_slot(slot.date,slot.time)}},"Remove")
                                        )
                                    )
                                )
                            }else{
                                children.push(
                                    e("tr",null,
                                        e("td",null,(function(){
                                            var s=(slot.time*1)*settings.granularity;
                                            var e=(slot.time*1+1)*settings.granularity;
                                            return format_time(s)+"-"+format_time(e);
                                        })()),
                                        e("td",null,"Occupied")
                                    )
                                )
                            }
                        })(slots[i])}
                    }
                    return children;
                })()))
            )
        );
    }
});

var EditApptDialog = c({
    componentWillMount: function () {
        this.setState({
            "time_slots": [],
            "selected_date": this.props.appt.date,
            "selected_time": this.props.appt.time,
            "selected_status": this.props.appt.status
        });
        this.load_time_slots();
    },
    load_time_slots: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_get_time_slots",
            },
            function (res) {
                that.setState({
                    "time_slots": res
                });
            }
        );
    },
    select_status: function (event) {
        this.setState({"selected_status": event.target.value});
    },
    select_date: function () {
        var that = this;
        dialog_box(function (container, dialog) {
            ReactDOM.render(
                e(DatePicker, {
                    "time_slots": that.state.time_slots,
                    "date": that.state.selected_date,
                    "callback": function (date) {
                        that.setState({
                            "selected_time": false,
                            "selected_date": date
                        });
                        dialog.shut();
                    }
                }, null),
                container
            );
        }, "sm");
    },
    select_time: function () {
        var that = this;
        dialog_box(function (container, dialog) {
            ReactDOM.render(
                e(TimePicker, {
                    "time_slots": that.state.time_slots,
                    "date": that.state.selected_date,
                    "time": that.state.selected_time,
                    "duration": that.props.appt.appt_type_duration,
                    "callback": function (time) {
                        that.setState({
                            "selected_time": time
                        });
                        dialog.shut();
                    }
                }, null),
                container
            );
        }, "sm");
    },
    submit: function () {
        if (!this.state.selected_status) {
            alert("Please select a status");
            return;
        }
        if (!this.state.selected_date) {
            alert("Please select a date");
            return;
        }
        if (!this.state.selected_time) {
            alert("Please select a time");
            return;
        }

        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_edit_appt",
                "appt_id": this.props.appt.appt_id,
                "status": this.state.selected_status,
                "date": this.state.selected_date,
                "time": this.state.selected_time
            },
            function (res) {
                that.props.dialog.shut();
                reload();
            }
        );
    },
    confirm_request: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_confirm_request",
                "appt_id": this.props.appt.appt_id
            },
            function (res) {
                if(res.code != 0){
                    alert('confirm failed!')
                }else{
                    that.props.dialog.shut();
                    reload();
                }
            }
        );
    },
    reject_request: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_reject_request",
                "appt_id": this.props.appt.appt_id
            },
            function (res) {
                that.props.dialog.shut();
                reload();
            }
        );
    },
    cancel: function () {
        var r = confirm("the cancellation is permanent, still want to proceed?");
        if(r){
            var that = this;
            $.post(
                ajaxurl, {
                    "action": "ap_provider_cancel_appt",
                    "appt_id": this.props.appt.appt_id
                },
                function (res) {
                    that.props.dialog.shut();
                    reload();
                }
            );
        }
    },
    render: function () {
        var that = this;
        return e("div", null,
            e("h2", null, "Edit Appointment"),
            e("div", null,
                e("div", null,
                    e("span", null, "ID: "),
                    e("span", null, that.props.appt.appt_id)
                ),
                e("div", null,
                    e("span", null, "Type: "),
                    e("span", null, that.props.appt.appt_type_title)
                ),
                e("div", null,
                    e("span", null, "Customer: "),
                    e("span", null, that.props.appt.customer_name)
                ),
                e("div", null,
                    e("span", null, "Customer Note: "),
                    e("span", null, that.props.appt.note ? that.props.appt.note : "N/A")
                ),
                e("div", null,
                    e("span", null, "Status"),
                    e("select", {
                            "className": "edit_appt_dialog_select",
                            "onChange": that.select_status,
                            "value": that.state.selected_status
                        },
                        e("option", {"value": "pending"}, "Pending"),
                        e("option", {"value": "approved"}, "Approved"),
                        e("option", {"value": "completed"}, "Completed")
                    )
                ),

                e("div", null,
                    e("span", null, "Date & Time"),
                    e("div", null,
                        e("button", {
                            "className": "edit_appt_dialog_date_time_btn",
                            "disabled": (!that.state.time_slots.length > 0),
                            "onClick": function () {
                                that.select_date()
                            }
                        }, ((that.state.selected_date) ? (that.state.selected_date) : ("Select a date"))),
                        e("button", {
                            "className": "edit_appt_dialog_date_time_btn",
                            "disabled": (!(that.state.time_slots.length > 0 && that.state.selected_date)),
                            "onClick": function () {
                                that.select_time()
                            }
                        }, ((that.state.selected_time) ? ((function () {
                            var s = (that.state.selected_time * 1) * settings.granularity;
                            var e = (that.state.selected_time * 1 + that.props.appt.appt_type_duration * 1) * settings.granularity;
                            return format_time(s) + "-" + format_time(e);
                        })()) : ("Select a time")))
                    )
                ),
                e("div", null,
                    e("span", null, "Pending Request: "),
                    e("span", null, that.props.appt.request ? that.props.appt.request : "N/A")
                ),
                e("div", null,
                    e("span", null, "Request Note: "),
                    e("span", null, that.props.appt.request_note ? that.props.appt.request_note : "N/A")
                ),
                e("div", null,
                    e("span", null, "Request Status: "),
                    e("span", null, that.props.appt.request_status ? that.props.appt.request_status : "N/A")
                ),
                that.props.appt.request_status == 'pending' && that.props.appt.request == 'reschedule' ?
                    e("div", null,
                        e("span", null, "New Date & Time: "),
                        e("span", null, that.props.appt.reschedule_date + ' ' + (function () {
                            var s = (that.props.appt.reschedule_time * 1) * settings.granularity;
                            var e = (that.props.appt.reschedule_time * 1 + that.props.appt.appt_type_duration * 1) * settings.granularity;
                            return format_time(s) + "-" + format_time(e);
                        })())
                    )
                    : null
            ),
            e("div", null,
                e("hr", null, null),
                e("button", {
                    disabled: that.props.appt.request_status == 'pending'?null:'disabled',
                    className: 'button-secondary',
                    onClick: that.confirm_request
                }, "Confirm Request"),
                e('span', {className: 'span-20px'}, ''),
                e("button", {
                    disabled: that.props.appt.request_status == 'pending'?null:'disabled',
                    className: 'button-secondary',
                    onClick: that.reject_request
                }, "Reject Request"),
                e("hr", null, null),
                e("button", {className: 'button-secondary', "onClick": that.cancel}, "Cancel this appointment"),
                e("hr", null, null),
                e("button", {className: 'button-primary', "onClick": that.submit}, "Submit")
            )
        )
    }
});

var NewApptDialog = c({
    componentWillMount: function () {
        this.setState({
            "appt_types": [],
            "customers": [],
            "time_slots": [],
            "selected_appt_type": false,
            "selected_appt_type_duration": 0,
            "selected_customer": false,
            "selected_date": false,
            "selected_time": false,
        });
        this.load_appt_types();
    },
    load_appt_types: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_get_appt_types",
            },
            function (res) {
                that.setState({
                    "appt_types": res
                });
            }
        );
    },
    load_customers: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_get_customers"
            },
            function (res) {
                that.setState({
                    "customers": res
                });
            }
        );
    },
    load_time_slots: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_get_time_slots",
            },
            function (res) {
                that.setState({
                    "time_slots": res
                });
            }
        );
    },
    select_appt_type: function (event) {
        var appt_type_id = event.target.value;
        this.setState({
            "customers": [],
            "time_slots": [],
            "selected_appt_type": appt_type_id,
            "selected_appt_type_duration": (function () {
                var appt_types = that.state.appt_types;
                for (var i = 0; i < appt_types.length; i++) {
                    if (appt_types[i].appt_type_id == appt_type_id) {
                        return appt_types[i].duration;
                    }
                }
            })(),
            "selected_customer": false,
            "selected_date": false,
            "selected_time": false
        });
        this.load_customers();
    },
    select_customer: function (event) {
        this.setState({"selected_customer": event.target.value});
        this.load_time_slots();
    },
    select_date: function () {
        var that = this;
        dialog_box(function (container, dialog) {
            ReactDOM.render(
                e(DatePicker, {
                    "time_slots": that.state.time_slots,
                    "date": that.state.selected_date,
                    "callback": function (date) {
                        that.setState({
                            "selected_time": false,
                            "selected_date": date
                        });
                        dialog.shut();
                    }
                }, null),
                container
            );
        }, "sm");
    },
    select_time: function () {
        var that = this;
        dialog_box(function (container, dialog) {
            ReactDOM.render(
                e(TimePicker, {
                    "time_slots": that.state.time_slots,
                    "date": that.state.selected_date,
                    "time": that.state.selected_time,
                    "duration": that.state.selected_appt_type_duration,
                    "callback": function (time) {
                        that.setState({
                            "selected_time": time
                        });
                        dialog.shut();
                    }
                }, null),
                container
            );
        }, "sm");
    },
    submit: function () {
        if (!this.state.selected_appt_type) {
            alert("Please select a appointment type");
            return;
        }
        if (!this.state.selected_customer) {
            alert("Please select a customer");
            return;
        }
        if (!this.state.selected_date) {
            alert("Please select a date");
            return;
        }
        if (!this.state.selected_time) {
            alert("Please select a time");
            return;
        }

        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_provider_new_appt",
                "appt_type": that.state.selected_appt_type,
                "status": 'pending',
                "customer": that.state.selected_customer,
                "date": that.state.selected_date,
                "time": that.state.selected_time,
                'note': 'created by provider'
            },
            function (res) {
                that.props.dialog.shut();
                reload();
            }
        );
    },
    render: function () {
        var that = this;
        return e("div", null,
            e("h2", null, "New Appointment"),
            e("div", null,
                e("div", null,
                    e("span", null, "Appointment Type"),
                    e.apply(that, ["select", {
                        "className": "new_appt_dialog_select",
                        "onChange": that.select_appt_type,
                        "value": that.state.selected_appt_type
                    }].concat((function () {
                        var children = [];
                        children.push(
                            e("option", {"disabled": true, "selected": true, "hidden": true, "value": false}, "")
                        )
                        for (var i = 0; i < that.state.appt_types.length; i++) {
                            (function (appt_type) {
                                children.push(
                                    e("option", {"value": appt_type.appt_type_id}, appt_type.title)
                                )
                            })(that.state.appt_types[i])
                        }
                        return children;
                    })()))
                ),
                e("div", null,
                    e("span", null, "Customer"),
                    e.apply(that, ["select", {
                        "className": "new_appt_dialog_select",
                        "onChange": that.select_customer,
                        "value": that.state.selected_customer,
                    }].concat((function () {
                        var children = [];
                        children.push(
                            e("option", {"disabled": true, "selected": true, "hidden": true, "value": false}, "")
                        )
                        for (var i = 0; i < that.state.customers.length; i++) {
                            (function (customer) {
                                children.push(
                                    e("option", {"value": customer.ID}, customer.display_name)
                                )
                            })(that.state.customers[i])
                        }
                        return children;
                    })()))
                ),
                e("div", null,
                    e("span", null, "Date & Time"),
                    e("div", null,
                        e("button", {
                            "className": "button-secondary new_appt_dialog_date_time_btn",
                            "disabled": (!that.state.time_slots.length > 0),
                            "onClick": function () {
                                that.select_date()
                            }
                        }, ((that.state.selected_date) ? (that.state.selected_date) : ("Select a date"))),
                        e("button", {
                            "className": "button-secondary new_appt_dialog_date_time_btn",
                            "disabled": (!(that.state.time_slots.length > 0 && that.state.selected_date && that.state.selected_appt_type_duration > 0)),
                            "onClick": function () {
                                that.select_time()
                            }
                        }, ((that.state.selected_time) ? ((function () {
                            var s = (that.state.selected_time * 1) * settings.granularity;
                            var e = (that.state.selected_time * 1 + that.state.selected_appt_type_duration * 1) * settings.granularity;
                            return format_time(s) + "-" + format_time(e);
                        })()) : ("Select a time")))
                    )
                )
            ),
            e("div", null,
                e("hr", null, null),
                e("button", {className: 'button-secondary', "onClick": that.submit}, "Submit")
            )
        )
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
    edit_appt: function (appt) {
        dialog_box(function (container, dialog) {
            ReactDOM.render(
                e(EditApptDialog, {
                    "appt": appt,
                    "dialog": dialog
                }, null),
                container
            );
        }, "md");
    },
    render:function(){
        var that=this;
        return e('div', null,
            e("table", {className: 'alignleft'},
                e('tr', null, e('th', null, e("button", {
                    className: 'button-primary', onClick: function () {
                        dialog_box(function (container, dialog) {
                            ReactDOM.render(
                                e(NewApptDialog, {
                                    "dialog": dialog,
                                }, null),
                                container
                            );
                        }, "md");
                    }
                }, "New Appointment")))
            ),
            e.apply(that,["table",{"className":"appointment_list"}].concat((function(){
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
                        e("th",null,"Request Status"),
                        e("th",null,""),
                        e("th",null,""),
                        e("th",null,""),
                        e("th",null,"Edit")
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
                            e("td",null,appt.request_status),
                            e("td",null,
                                e("button",{className: 'button-secondary', "disabled":(appt.status!="pending"),"onClick":function(){
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
                                e("button",{className: 'button-secondary',"disabled":(appt.status!="approved"),"onClick":function(){
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
                                e("button",{className: 'button-secondary',"onClick":function(){
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
                            e("td", null,
                                e("button", {
                                    className: 'button-secondary', "onClick": function () {
                                        that.edit_appt(appt)
                                    }
                                }, "Go")
                            ),
                        )
                    )
                })(that.state.appts[i])}
                return children;
            })()))
        );
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
                {className: 'button-primary',"onClick":function(){
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
            e("div",null,e("button",{className: 'button-secondary', "onClick":function(){
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