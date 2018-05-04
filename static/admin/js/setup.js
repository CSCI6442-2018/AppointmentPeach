let $ = jQuery;

let c = React.createClass;
let e = React.createElement;

let SetupForm = c({
    componentWillMount: function () {
        this.setState({
            'business_type': options.business_type,
            'granularity': options.granularity
        });
    },
    submit: function () {
        let that = this;
        $.post(
            ajaxurl, {
                'action': 'ap_setup',
                'business_type': that.state.business_type,
                'granularity': that.state.granularity
            },
            function (res) {
                if (res.status) {
                    alert(options.granularity);
                    alert('Successfully Saved!');
                    alert(res.granularity);
                    window.location.href = res.href;
                } else {
                    alert('Setup Failed!');
                }
            }
        );
    },
    render: function () {
        return e('div', null,
            e('label', null, 'Granularity: '),
            e('input', {'type': 'text', 'id': 'granularity', 'value': this.state.granularity}, this.state.granularity),
            e('hr', null, null),
            e('label', null, 'Business Type: '),
            e('input', {
                'type': 'text',
                'id': 'business_type',
                'value': this.state.business_type
            }, this.state.business_type),
            e('hr', null, null),
            e('button', {'onClick': this.submit}, 'Submit'))
    }
});

let App = c({
    render: function () {
        return e('div', null,
            e('h1', null, 'Appointment Peach Setup'),
            e(SetupForm, null, null));
    }
});

$(document).ready(function () {
    ReactDOM.render(e(App, null, null), document.getElementById('setup_form_container'));
});

