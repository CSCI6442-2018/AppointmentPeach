var $=jQuery;

var c=React.createClass;
var e=React.createElement;

var CustomerList=c({
    componentWillMount:function(){
        this.setState({
            'customers' :[]
        });
        this.load_customers();
    },
    load_customers:function(){
        var that=this;
        $.post(
            ajaxurl,{
                "action":"ap_customers_menu_get_users"
            },
            function(res){
                that.setState({
                    "customers":res
                });
            }
        );
    },
    render:function(){
        var that=this;
        return e.apply(that,["table",{"className":"customer_list"}].concat((function(){
            var children=[];
            children.push(
                e("tr",null,
                    e("th",null,"ID"),
                    e("th",null,"Name"),
                    e("th",null,"Email"),
                )
            );
            for(var i=0;i<that.state.customers.length;i++){(function(customer){
                children.push(
                    e("tr", null,
                        e("td",null,customer.ID),
                        e("td",null,customer.display_name),
                        e("td",null,customer.user_email)
                    )
                )
            })(that.state.customers[i])}
            return children;
        })()))
    }
})
var App=c({
    render:function(){
        return e("div",null,
            e("h1",null,settings.customer_title+" Management"),
            e(CustomerList,null,null)
        )
    }
});

$(document).ready(function(){
    ReactDOM.render(
        e(App,null,null),
        document.getElementById("customer_list_container")
    );
});
