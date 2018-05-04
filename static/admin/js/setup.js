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
        $.post(
            ajaxurl, {
                'action': 'ap_setup',
                'business_type': this.state.business_type,
                'granularity': this.state.granularity
            },
            function (res) {
                alert(res.message);
                if (res.status) {
                    window.location.href = res.href;
                }
            }
        );
    },

    handleChange:function(event){
        this.setState({
            [event.target.id]: event.target.value
        })
    },
    render: function () {
        var that = this;
        return e('div', null,
            e('label', null, 'Granularity: '),
            e('input', {
                type: 'text',
                id: 'granularity',
                label:'Granularity',
                onChange: that.handleChange,
                required: true,
                value:that.state.granularity
            }, null),
            e('hr', null, null),
            e('label', null, 'Business Type: '),
            e('input', {
                type: 'text',
                id: 'business_type',
                label:'Business Type',
                onChange: that.handleChange,
                required: true,
                value:that.state.business_type
            }, null),
            e('hr', null, null),
            e('button', {onClick: that.submit}, 'Submit'))
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