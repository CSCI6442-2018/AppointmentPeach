var $=jQuery;

//
var c=React.createClass;
var e=React.createElement;

var Hello=c({
    render:function(){
        return e("div",null,"Hello World");
    }
});

ReactDOM.render(
    e(Hello,null,null),
    document.getElementById("ap")
);