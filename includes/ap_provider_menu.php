<?php

function ap_provider_menu(){
    wp_enqueue_style( 'materialize_style',"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css" );
    wp_enqueue_script( 'materialize_js',"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js" );
    wp_enqueue_style('ap_style_provider_menu', plugins_url("../static/ap_provider_menu.css",__File__));
    wp_enqueue_script('ap_script_provider_menu',plugins_url('../static/ap_provider_menu.js',__File__), array('jquery'));
    // pass the ajax file as js obejct to separate js file to use it
    wp_localize_script('ap_script_provider_menu', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
    global $wpdb;
    // query the appointment type
    $res = $wpdb->get_results("select * from ap_appt_types");
    ?>
    <script type="text/javascript">
        // store the query result in js object
        var dataPool = {
            appt_type_table: <?php echo json_encode($res)?>
        };
        // console.log(dataPool);
    </script>
     <!-- generate the appointment type table -->
    <div id ='appt_types_table_wrapper' class = 'container'>
        <table id='appt_types_table_head' style="width: 100%;">
            <caption><h2>Appointment type</h2></caption>
            <?php 
                //print the head of the table
                if(count($res)!= 0)
                {
                    $value = $res[0];
                    foreach($value as $key2=>$value2){
                        echo "<th style='width: 20%;'>$key2</th>";
                    }  
                }else{
                    echo "<th>there is no rows in the table</th>";
                }
            ?>
        </table>

        <div class = "inner_table_div" style = 'height: 300px; overflow-y: auto; text-align: center;'>	
            <table id ='appt_types_table_body' style="width: 100%;">
                <tbody>
                <?php
                if(count($res)!= 0)
                {
                    // print out the data in scrollable inner table
                    foreach($res as $key=>$value){
                        echo "<tr>";
                        foreach ($value as $key2 => $value2) {
                            echo "<td style='width: 20%;' id = $key2>";
                            echo $value2;
                            echo "</td>";
                        }
                        echo "</tr>";
                    }  
                }
                ?>
                </tbody>
            </table>
        </div>
        <div id='message'></div>
        <div id = 'message_2'></div>
        <!--edit button-->
        <div>
            <a class = 'waves-effect waves-light btn' id = 'edit_button'>edit</a>
        </div>
    </div>

    <!-- genenrate the hiden form -->
    <div id='appt_type_edit' class = 'row'>
        <form class = 'col s12'>
            <!-- row of form -->
            <div class = 'row'>
                <!-- column of form -->
                <div class = 'input-field col s6'>
                    <input id = 'appt_title' placeholder="" type = 'text' class = 'validate'>
                    <label for='appt_title'>Appointment Type Title</label>
                </div>			
                
            </div>
            <div class = 'row'>
                <!-- column of form , span the full row-->
                <div class = 'input-field col s12'>
                    <input id = 'appt_description' placeholder="type into the description"  type = 'text' class = 'validate'>
                    <label for='appt_description'>Appointment Type Description</label>
                </div>
                
            </div>			
            <div class = 'row'>
                <!-- column of form-->
                <div class = 'input-field col s6'>
                    <input id = 'appt_icon' type = 'text' class = 'validate' placeholder="">
                    <label for='appt_icon'>Appointment Type Icon</label>
                </div>
                <div class = 'input-field col s6'>
                    <input id = 'appt_time' type = 'text' class = 'validate' placeholder="">
                    <label for='appt_time'>Appointment Duration (in minutes)</label>
                </div>
            </div>
            <div class="row">
                <a class = 'waves-effect waves-light btn' id = 'save_button'>save</a>
                <a class = 'waves-effect waves-light btn' id = 'edit_button'>cancel</a>
            </div>
        </form>
    </div>
    <?php
}

require_once("ap_provider_menu_requesthandler.php");

add_action('admin_menu',function(){
    add_submenu_page(
        'overview',
        'Provider',
        'Provider',
        'manage_options',
        'ap_provider_menu',
        "ap_provider_menu"
    );
});
?>