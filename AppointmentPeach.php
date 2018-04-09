<?php
/*
Plugin Name:  AppointmentPeach
Plugin URI:   http://appointmentpeach.com
Description:  Self-Booked Customer Appointments
Version:      0.0.1
Author:       GWU CSCI6442 2018
Author URI:   https://github.com/CSCI6442-2018
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  AppointmentPeach
Domain Path:  /languages
*/

/*admin_table*/
add_action('wp_ajax_admin_table', function(){
    global $wpdb;

    $operation=$_POST["operation"];
    $name=$_POST["name"];
    $keys=$_POST["keys"];
    $vals=$_POST["vals"];

    if($operation=="INSERT"){

        $vals_k=array();
        $vals_v=array();
        foreach($vals as $val_k=>$val_v){
            array_push($vals_k,$val_k);
            array_push($vals_v,$val_v);
        }

        $k_sql="";
        for($i=0;$i<count($vals_k);$i++){
            $k_sql.="$vals_k[$i]";
            if($i<count($vals_k)-1){
                $k_sql.=",";
            }
        }

        $v_sql="";
        for($i=0;$i<count($vals_v);$i++){
            $v_sql.="'$vals_v[$i]'";
            if($i<count($vals_v)-1){
                $v_sql.=",";
            }
        }

        $sql="INSERT INTO $name ($k_sql) VALUES ($v_sql);";echo($sql);
        $wpdb->query($sql);
    }

    if($operation=="DELETE"){
        $keys_kv=array();
        foreach($keys as $key_k=>$key_v){
            array_push($keys_kv,array("k"=>$key_k,"v"=>$key_v));
        }

        $keys_sql="";
        for($i=0;$i<count($keys_kv);$i++){
            $key_k=$keys_kv[$i]["k"];
            $key_v=$keys_kv[$i]["v"];

            $keys_sql.="$key_k='$key_v'";
            if($i<count($keys_kv)-1){
                $keys_sql.=" AND ";
            }
        }

        $sql="DELETE FROM $name WHERE $keys_sql;";
        $wpdb->query($sql);
    }

    if($operation=="UPDATE"){

        $vals_kv=array();
        foreach($vals as $val_k=>$val_v){
            array_push($vals_kv,array("k"=>$val_k,"v"=>$val_v));
        }

        $vals_sql="";
        for($i=0;$i<count($vals_kv);$i++){
            $val_k=$vals_kv[$i]["k"];
            $val_v=$vals_kv[$i]["v"];

            $vals_sql.="$val_k='$val_v'";
            if($i<count($vals_kv)-1){
                $vals_sql.=",";
            }
        }

        $keys_kv=array();
        foreach($keys as $key_k=>$key_v){
            array_push($keys_kv,array("k"=>$key_k,"v"=>$key_v));
        }

        $keys_sql="";
        for($i=0;$i<count($keys_kv);$i++){
            $key_k=$keys_kv[$i]["k"];
            $key_v=$keys_kv[$i]["v"];

            $keys_sql.="$key_k='$key_v'";
            if($i<count($keys_kv)-1){
                $keys_sql.=" AND ";
            }
        }

        $sql="UPDATE $name SET $vals_sql WHERE $keys_sql;";
        $wpdb->query($sql);
    }

    if($operation=="SELECT_ALL"){
        $sql="SELECT * from $name";
        $res=$wpdb->get_results($sql);
        wp_send_json($res);
    }

    wp_die();
});

add_shortcode(
    'appointment_peach',
    function($atts=[], $content=null){

        wp_enqueue_style('ap_style_app', plugins_url('./static/app.css', __FILE__));

        wp_enqueue_script('ap_script_react', 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-with-addons.min.js');
        wp_enqueue_script('ap_script_react_dom', 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js');
        wp_enqueue_script('ap_script_app', plugins_url('./static/app.js',__FILE__), array('jquery'));
        wp_localize_script('ap_script_app','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

        ?>
        <div id="ap">
        </div>
        <?php
        return $content;
    }
);

add_action('admin_menu',function(){
    add_menu_page(
        'AppointmentPeach',
        'AppointmentPeach',
        'manage_options',
        basename(__FILE__),
        function(){
            if(!current_user_can('manage_options')){
                return;
            }

            wp_enqueue_style('ap_style_admin', plugins_url('./static/admin.css', __FILE__));

            wp_enqueue_script('ap_script_admin', plugins_url('./static/admin.js',__FILE__), array('jquery'));
            wp_localize_script('ap_script_admin','ajax_object',array('ajax_url' => admin_url('admin-ajax.php')));

            ?>
            <div id="ap_admin">
                <div id="ap_admin_dialog_box_mask"></div>
                <h1>AppointmentPeach Admin Menu</h1>
                <h2>Locations</h2>
                <div id="ap_locations"></div>
                <h2>Users</h2>
                <div id="ap_users"></div>
                <h2>Time Slots</h2>
                <div id="ap_time_slots"></div>
                <h2>Appointment Types</h2>
                <div id="ap_appt_types"></div>
                <h2>Appointments</h2>
                <div id="ap_appointments"></div>
                <h2>Provider Appointment Types</h2>
                <div id="ap_provider_appt_types"></div>
            </div>
            <?php
        }
    );
});

function activation(){
    global $wpdb;
    $sql=file_get_contents(plugins_url('./sql/activation.sql', __FILE__));
    $wpdb->query($sql);
}
register_activation_hook(__FILE__,"activation");

function uninstall(){
    global $wpdb;
    $sql=file_get_contents(plugins_url('./sql/uninstall.sql', __FILE__));
    $wpdb->query($sql);
}
register_uninstall_hook(__FILE__,"uninstall");
?>