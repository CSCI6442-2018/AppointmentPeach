<?php

function get_bus_type()
{
    global $wpdb;
    $sql = "select value from ap_settings where ap_settings.key= 'business_type'";
    $result = $wpdb->get_results($sql);
    echo strtoupper($result[0]->value);
}

/**
 * [get_num_provider get the number of providers in database]
 * @return [int] [number of provider]
 */
function get_num_role($role)
{
    global $wpdb;
    $sql = "SELECT COUNT(*) as num FROM ap_users WHERE role = '" . $role . "';";
    $result = $wpdb->get_results($sql);
    echo $result[0]->num;
}

/**
 * [get_num_customers get the number of users in database]
 * @return [int] [number of customer]
 */
function get_num_customer()
{
    global $wpdb;
    $sql = "SELECT COUNT(*) as num FROM ap_users WHERE role = 'customer';";
    $result = $wpdb->get_results($sql);
    echo $result[0]->num;
}

function get_num_status($status)
{
    global $wpdb;
    $sql = "SELECT COUNT(*) as num FROM ap_appointments WHERE status = '" . $status . "'";
    $result = $wpdb->get_results($sql);
    echo $result[0]->num;
}


function add_overview_menu()
{
    wp_enqueue_style('materialize_style', "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css");
    wp_enqueue_script('materialize_js', "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js");
    wp_enqueue_style("materialize_icon", "https://fonts.googleapis.com/icon?family=Material+Icons");
    ?>
    <div class="container">
        <div class="row">
            <div class="col s1">

            </div>
            <div class="col s10 white z-depth-1">
                <h3 class='center red-text text-lighten-2'>AppointmentPeach</h3>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col s7">
                <div class="card hoverable">
                    <blockquote><span class="card-title">Appointment</span></blockquote>
                    <div class="card-content">
                        <div class="collection">
                            <a href="#" class="collection-item red-text"><span
                                        class="new badge red"><?php get_num_status("pending"); ?></span>Pending</a>
                            <a href="#" class="collection-item green-text"><span
                                        class="badge green-text"><?php get_num_status("approved"); ?></span>Approved</a>
                            <a href="#" class="collection-item green-text text-darken-2"><span
                                        class="badge green-text text-darken-2 "><?php get_num_status("completed"); ?></span>Completed</a>
                            <a href="#" class="collection-item grey-text"><span
                                        class="badge"><?php get_num_status("canceled"); ?></span>Canceled</a>
                        </div>
                        <!--End Collection -->
                    </div>
                    <!-- End car content panel -->
                    <div class="card-action">
                        <a href="#" class="red-text text-lighten-2">Go to detail</a>
                    </div>
                    <!-- End card action panel -->
                </div>
                <!-- End card panel -->
            </div>
            <div class="col s5">
                <div class="card">
                    <blockquote>
                        <span class="card-title">Business type</span>
                    </blockquote>

                    <h5 class="center"><?php get_bus_type(); ?></h5>

                </div>
                <div class="card">
                    <blockquote><span class="card-title">Users</span></blockquote>
                    <div class="card-content">
                        <div class="collection">
                            <a href="#" class="collection-item red-text"><span
                                        class="badge red-text"><?php get_num_role("provider"); ?></span>Provider</a>
                            <a href="#" class="collection-item green-text"><span
                                        class="badge green-text"><?php get_num_role("customer"); ?></span>Customer</a>
                        </div>
                    </div>
                    <div class="card-action">
                        <a href="#" class="red-text text-lighten-2">Go to detail</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}

add_action('admin_menu', function(){
    add_menu_page(
        "Business Administrator",
        "AppointmentPeach",
        "manage_options",
        "overview",
        'add_overview_menu'
    );
});
?>
