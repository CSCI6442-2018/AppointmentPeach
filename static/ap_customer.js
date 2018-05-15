var $ = jQuery;

//
var c = React.createClass;
var e = React.createElement;

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
            e("button", {"onClick": this.submit}, "Submit")
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
            e("button", {"onClick": this.submit}, "Submit")
        )
    }
});

function format_time(t) {
    var h = Math.floor(t / 60);
    var m = t % 60;

    return (
        Math.floor(h / 10).toString() +
        (h % 10).toString() +
        ":" +
        Math.floor(m / 10).toString() +
        (m % 10).toString()
    )
}

var EditApptDialog = c({
    componentWillMount: function () {
        this.setState({
            "time_slots": [],
            "selected_date": this.props.appt.date,
            "selected_time": this.props.appt.time,
            'request_note': null
        });
        this.load_time_slots();
    },
    load_time_slots: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_appointments_menu_get_provider_time_slots",
                "provider_id": this.props.appt.provider_id
            },
            function (res) {
                that.setState({
                    "time_slots": res
                });
            }
        );
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
    reschedule: function () {
        if (!this.state.selected_date) {
            alert("Please select a date");
            return;
        }
        if (!this.state.selected_time) {
            alert("Please select a time");
            return;
        }
        if (!this.state.request_note) {
            alert("Please provide request note for this request");
            return;
        }

        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_customer_reschedule",
                "appt_id": this.props.appt.appt_id,
                "date": this.state.selected_date,
                "time": this.state.selected_time,
                'request_note': this.state.request_note
            },
            function (res) {
                if (res.code == 0) {
                    alert('Send reschedule request succeeded! This request will be reviewed by the provider.');
                    that.props.dialog.shut();
                    reload();
                } else {
                    alert('submit failed!');
                }
            }
        );
    },
    cancel: function () {
        var r = confirm("the cancellation is permanent, still want to proceed?");
        if (r) {
            if (!this.state.request_note) {
                alert("Please provide request note for this request");
                return;
            }
            var that = this;
            $.post(
                ajaxurl, {
                    "action": "ap_customer_cancel_appt",
                    "appt_id": that.props.appt.appt_id,
                    "request_note": that.state.request_note
                },
                function (res) {
                    if (res.code == 0) {
                        alert('Send cancel request succeeded! This request will be reviewed by the provider.');
                        that.props.dialog.shut();
                        reload();
                    } else {
                        alert('submit failed!');
                    }

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
                    e("span", null, "Provider: "),
                    e("span", null, that.props.appt.provider_name)
                ),
                e("div", null,
                    e("span", null, "Note: "),
                    e("span", null, that.state.note)
                ),
                e("div", null,
                    e("span", null, "Status: "),
                    e("span", null, that.props.appt.status)
                ),
                e("td", null, that.props.appt.date),
                e("td", null,),

                e("div", null,
                    e("span", null, "Date & Time: "),
                    e("span", null, that.props.appt.date + ' ' + (function () {
                        var s = (that.props.appt.time * 1) * settings.granularity;
                        var e = (that.props.appt.time * 1 + that.props.appt.appt_type_duration * 1) * settings.granularity;
                        return format_time(s) + "-" + format_time(e);
                    })())
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
            ),
            e("div", null,
                e("hr", null, null),
                e("div", null,
                    e("span", null, "New Date & Time"),
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
                e("div", {className: 'edit-request-div'},
                    e("span", null, "Request Note: "),
                    e("textarea", {
                        onChange: function (e) {
                            that.setState({
                                request_note: e.target.value
                            });
                        }
                    }, that.state.request_note)
                ),
                e("button", {
                    className: 'button-primary',
                    "onClick": that.reschedule
                }, "Request Reschedule"),
                e('span', {className: 'action-btn'}, ""),
                e("button", {className: 'button-primary', "onClick": that.cancel}, "Request Cancel")
            )
        )
    }
});

var ApptList = c({
    componentWillMount: function () {
        this.setState({
            appts: []
        });
        this.load_appts();

        var that = this;
        relaod_subscribers.push(function () {
            that.load_appts();
        })
    },
    load_appts: function () {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_customer_get_appts_info"
            },
            function (res) {
                that.setState({
                    "appts": res
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
    render: function () {
        var that = this;
        return e.apply(that, ["table", {"className": "appointment_list"}].concat((function () {
            var children = [];
            children.push(
                e("tr", null,
                    e("th", null, "Type"),
                    e("th", null, "Provider"),
                    e("th", null, "Provider Email"),
                    e("th", null, "Provider Phone"),
                    e("th", null, "Provider Location"),
                    e("th", null, "Date"),
                    e("th", null, "Time"),
                    e("th", null, "Note"),
                    e("th", null, "Status"),
                    e("th", null, "Pending Request"),
                    e("th", null, "Request Note"),
                    e("th", null, "Request Status"),
                    e("th", null, "Edit"),
                )
            );
            for (var i = 0; i < that.state.appts.length; i++) {
                (function (appt) {
                    children.push(
                        e("tr", null,
                            e("td", null, appt.appt_type_title),
                            e("td", null, appt.provider_name),
                            e("td", null, appt.provider_email),
                            e("td", null, appt.provider_phone),
                            e("td", null, appt.provider_location),
                            e("td", null, appt.date),
                            e("td", null, (function () {
                                var s = (appt.time * 1) * settings.granularity;
                                var e = (appt.time * 1 + appt.appt_type_duration * 1) * settings.granularity;
                                return format_time(s) + "-" + format_time(e);
                            })()),
                            e("td", null, appt.note),
                            e("td", null, (function () {
                                return {
                                    "pending": "Pending",
                                    "approved": "Approved",
                                    "completed": "Completed"
                                }[appt.status]
                            })()),
                            e("td", null, appt.request),
                            e("td", null, appt.request_note),
                            e("td", null, appt.request_status),
                            e("td", null, e('button', {
                                disabled: appt.request_status == "pending" ? 'disabled' : null,
                                className: 'button-secondary', onClick: function () {
                                    that.edit_appt(appt)
                                }
                            }, 'Go')),
                        )
                    )
                })(that.state.appts[i])
            }
            return children;
        })()))
    }
});

var App = c({
    render: function () {
        return e("div", null,
            e("h1", {className: 'ap_menu_title'}, "Appointments"),
            e('hr', null, null),
            e('div', {className: 'ap_menu_content'},
                e(ApptList, null, null),
            )
        )
    }
});

$(document).ready(function () {
    ReactDOM.render(
        e(App, null, null),
        document.getElementById("ap_customer")
    );
});

var relaod_subscribers = [];

function reload() {
    for (let i = 0; i < relaod_subscribers.length; i++) {
        if (typeof relaod_subscribers[i] == "function") {
            relaod_subscribers[i]();
        }
    }
}