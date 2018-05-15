var $ = jQuery;

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
                "action": "ap_appointments_menu_edit_appt",
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
                "action": "ap_appointments_menu_confirm_request",
                "appt_id": this.props.appt.appt_id
            },
            function (res) {
                if (res.code != 0) {
                    alert('confirm failed!')
                } else {
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
                "action": "ap_appointments_menu_reject_request",
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
        if (r) {
            var that = this;
            $.post(
                ajaxurl, {
                    "action": "ap_appointments_menu_cancel_appt",
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
                    e("span", null, "Provider: "),
                    e("span", null, that.props.appt.provider_name)
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
                that.props.appt.request_status == 'pending' ?
                    e("div", null,
                        e("span", null, "New Date & Time: "),
                        e("span", null, that.props.appt.reschedule_date + ' ' + (function () {
                            var s = (that.props.appt.time * 1) * settings.granularity;
                            var e = (that.props.appt.reschedule_time * 1 + that.props.appt.appt_type_duration * 1) * settings.granularity;
                            return format_time(s) + "-" + format_time(e);
                        })())
                    )
                    : null
            ),
            e("div", null,
                e("hr", null, null),
                e("button", {
                    disabled: that.props.appt.request_status == 'pending' ? null : 'disabled',
                    className: 'button-secondary',
                    onClick: that.confirm_request
                }, "Confirm Request"),
                e('span', {className: 'span-20px'}, ''),
                e("button", {
                    disabled: that.props.appt.request_status == 'pending' ? null : 'disabled',
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

var ApptList = c({
    componentWillMount: function () {
        this.setState({
            appts: [],
            providers: [],
            customers: [],
            provider_filter: "all",
            customer_filter: "all",
            status_filter: "all"
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
                "action": "ap_appointments_menu_get_appts_info"
            },
            function (res) {
                providers = [];
                customers = [];

                for (var i = 0; i < res.length; i++) {
                    var appt = res[i];

                    var provider = {};
                    provider.provider_id = appt.provider_id;
                    provider.provider_name = appt.provider_name;
                    var np = true;
                    for (var j = 0; j < providers.length; j++) {
                        var p = providers[j];
                        if (p.provider_id == provider.provider_id) {
                            np = false;
                            break;
                        }
                    }
                    if (np) {
                        providers.push(provider);
                    }

                    var customer = {};
                    customer.customer_id = appt.customer_id;
                    customer.customer_name = appt.customer_name;
                    var nc = true;
                    for (var j = 0; j < customers.length; j++) {
                        var c = customers[j];
                        if (c.customer_id == customer.customer_id) {
                            nc = false;
                            break;
                        }
                    }
                    if (nc) {
                        customers.push(customer);
                    }
                }

                that.setState({
                    "appts": res,
                    "providers": providers,
                    "customers": customers
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
        return e("div", null,
            e("table", {className: 'alignleft appointment-filter'},
                e('tr', null,
                    e("th", null, "Filter by provider: "),
                    e('td', null,
                        e.apply(that, ["select", {
                            "onChange": function (event) {
                                that.setState({provider_filter: event.target.value})
                            }, "value": this.state.provider_filter
                        }].concat((function () {
                            var children = [];
                            children.push(e("option", {"value": "all", "selected": true}, "All"));
                            for (var i = 0; i < that.state.providers.length; i++) {
                                (function (provider) {
                                    children.push(e("option", {"value": provider.provider_id}, provider.provider_name));
                                })(providers[i])
                            }
                            return children;
                        })())))
                ),
                e('tr', null, e("th", null, "Filter by customer: "), e('td', null, e.apply(that, ["select", {
                    "onChange": function (event) {
                        that.setState({customer_filter: event.target.value})
                    }, "value": this.state.customer_filter
                }].concat((function () {
                    var children = [];
                    children.push(e("option", {"value": "all", "selected": true}, "All"));
                    for (var i = 0; i < that.state.customers.length; i++) {
                        (function (customer) {
                            children.push(e("option", {"value": customer.customer_id}, customer.customer_name));
                        })(customers[i])
                    }
                    return children;
                })())))),
                e('tr', null, e("th", null, "Filter by status: "), e('td', null, e("select", {
                        "onChange": function (event) {
                            that.setState({status_filter: event.target.value})
                        }, "value": this.state.status_filter
                    },
                    e("option", {"value": "all"}, "All"),
                    e("option", {"value": "pending"}, "Pending"),
                    e("option", {"value": "approved"}, "Approved"),
                    e("option", {"value": "completed"}, "Completed")
                ))),
                e('tr', null, e('th', null, e("button", {
                    className: 'button-primary', onClick: function () {
                        dialog_box(function (container, dialog) {
                            ReactDOM.render(
                                e(NewApptDialog, {
                                    "dialog": dialog
                                }, null),
                                container
                            );
                        }, "md");
                    }
                }, "New Appointment")))
            ),
            e.apply(that, ["table", {"className": "appointment_list"}].concat((function () {
                var children = [];
                children.push(
                    e("tr", null,
                        e("th", null, "ID"),
                        e("th", null, "Type"),
                        e("th", null, "Status"),
                        e("th", null, "Provider"),
                        e("th", null, "Customer"),
                        e("th", null, "Note"),
                        e("th", null, "Date"),
                        e("th", null, "Time"),
                        e("th", null, "Pending Request"),
                        e("th", null, "Request Note"),
                        e("th", null, "Request Status"),
                        e("th", null, "Edit")
                    )
                );
                for (var i = 0; i < that.state.appts.length; i++) {
                    (function (appt) {
                        var provider_filter = that.state.provider_filter;
                        var customer_filter = that.state.customer_filter;
                        var status_filter = that.state.status_filter;
                        if (
                            ((provider_filter == "all") || (appt.provider_id == provider_filter)) &&
                            ((customer_filter == "all") || (appt.customer_id == customer_filter)) &&
                            ((status_filter == "all") || (appt.status == status_filter))
                        ) {
                            children.push(
                                e("tr", null,
                                    e("td", null, appt.appt_id),
                                    e("td", null, appt.appt_type_title),
                                    e("td", null, (function () {
                                        return {
                                            "pending": "Pending",
                                            "approved": "Approved",
                                            "completed": "Completed"
                                        }[appt.status]
                                    })()),
                                    e("td", null, appt.provider_name),
                                    e("td", null, appt.customer_name),
                                    e("td", null, appt.note),
                                    e("td", null, appt.date),
                                    e("td", null, (function () {
                                        var s = (appt.time * 1) * settings.granularity;
                                        var e = (appt.time * 1 + appt.appt_type_duration * 1) * settings.granularity;
                                        return format_time(s) + "-" + format_time(e);
                                    })()),
                                    e("td", null, appt.request),
                                    e("td", null, appt.request_note),
                                    e("td", null, appt.request_status),
                                    e("td", null,
                                        e("button", {
                                            className: 'button-secondary', "onClick": function () {
                                                that.edit_appt(appt)
                                            }
                                        }, "Go")
                                    ),
                                )
                            )
                        }
                    })(that.state.appts[i])
                }
                return children;
            })()))
        );
    }
});

var NewApptDialog = c({
    componentWillMount: function () {
        this.setState({
            "appt_types": [],
            "providers": [],
            "customers": [],
            "time_slots": [],
            "selected_appt_type": false,
            "selected_appt_type_duration": 0,
            "selected_provider": false,
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
                "action": "ap_appointments_menu_get_appt_types"
            },
            function (res) {
                that.setState({
                    "appt_types": res
                });
            }
        );
    },
    load_providers: function (appt_type_id) {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_appointments_menu_get_providers_by_appt_type",
                "appt_type_id": appt_type_id
            },
            function (res) {
                that.setState({
                    "providers": res
                });
            }
        );
    },
    load_costomers: function (appt_type_id) {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_appointments_menu_get_customers"
            },
            function (res) {
                that.setState({
                    "customers": res
                });
            }
        );
    },
    load_time_slots: function (provider_id) {
        var that = this;
        $.post(
            ajaxurl, {
                "action": "ap_appointments_menu_get_provider_time_slots",
                "provider_id": provider_id
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
        var that = this;
        this.setState({
            "providers": [],
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
            "selected_provider": false,
            "selected_customer": false,
            "selected_date": false,
            "selected_time": false
        });
        this.load_providers(appt_type_id);
        this.load_costomers(appt_type_id);
    },
    select_provider: function (event) {
        var provider_id = event.target.value;
        this.setState({
            "time_slots": [],
            "selected_provider": provider_id,
            "selected_date": false,
            "selected_time": false
        });
        this.load_time_slots(provider_id)
    },
    select_customer: function (event) {
        this.setState({"selected_customer": event.target.value});
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
        if (!this.state.selected_provider) {
            alert("Please select a provider");
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
                "action": "ap_appointments_menu_new_appt",
                "appt_type": this.state.selected_appt_type,
                "status": 'pending',
                "provider": this.state.selected_provider,
                "customer": this.state.selected_customer,
                "date": this.state.selected_date,
                "time": this.state.selected_time,
                'note': 'created by business administrator'
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
                    e("span", null, "Provider"),
                    e.apply(that, ["select", {
                        "className": "new_appt_dialog_select",
                        "onChange": that.select_provider,
                        "value": that.state.selected_provider,
                        "disabled": (!that.state.providers.length > 0)
                    }].concat((function () {
                        var children = [];
                        children.push(
                            e("option", {"disabled": true, "selected": true, "hidden": true, "value": false}, "")
                        )
                        for (var i = 0; i < that.state.providers.length; i++) {
                            (function (provider) {
                                children.push(
                                    e("option", {"value": provider.ID}, provider.display_name)
                                )
                            })(that.state.providers[i])
                        }
                        return children;
                    })()))
                ),
                e("div", null,
                    e("span", null, "Costomer"),
                    e.apply(that, ["select", {
                        "className": "new_appt_dialog_select",
                        "onChange": that.select_customer,
                        "value": that.state.selected_customer,
                        "disabled": (!that.state.providers.length > 0)
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
                            "className": "new_appt_dialog_date_time_btn",
                            "disabled": (!that.state.time_slots.length > 0),
                            "onClick": function () {
                                that.select_date()
                            }
                        }, ((that.state.selected_date) ? (that.state.selected_date) : ("Select a date"))),
                        e("button", {
                            "className": "new_appt_dialog_date_time_btn",
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
                e("button", {"onClick": that.submit}, "Submit")
            )
        )
    }
});

var App = c({
    render: function () {
        return e("div", null,
            e("h1", {className: 'ap_menu_title'}, "Appointments Management"),
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
        document.getElementById("ap_appointments_menu")
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