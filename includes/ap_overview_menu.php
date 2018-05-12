<?php

add_action('wp_ajax_ap_overview_update_customer_title', function (){
    $title = $_POST['title'];
    $options = get_option('wp_custom_appointment_peach');
    $options['customer_title'] = $title;
    update_option('wp_custom_appointment_peach', $options);
    wp_send_json(['status'=>true, 'message'=>'save succeeded']);
});

add_action('admin_menu', function () {
    add_menu_page("Business Administrator", "AppointmentPeach", "ap_business_administrator", "overview", function () {

        global $wpdb;

        $settings = get_option('wp_custom_appointment_peach');
        $customer_title = $settings['customer_title'];
        $customers = get_users(['role' => 'subscriber']);
        $active_providers = get_users(['role' => 'ap_provider', 'meta_key' => 'activated','meta_compare' => 'EXISTS']);
        $inactive_providers =  get_users(['role' => 'ap_provider', 'meta_key' => 'activated', 'meta_compare' => 'NOT EXISTS']);

        $appt_types = $wpdb->get_results("SELECT * from ap_appt_types;");

        $active_appt_types = [];
        $inactive_appt_types = [];

        foreach ($appt_types as $appt_type){
            if($appt_type->active == 1){
                $active_appt_types[] = $appt_type;
            }

            if($appt_type->active == 0){
                $inactive_appt_types[] = $appt_type;
            }
        }

        $appts = $wpdb->get_results("SELECT * from ap_appointments;");

        $pending_appts = [];
        $approved_appts = [];
        $completed_appts = [];

        foreach ($appts as $appt){
            if($appt->status == 'pending'){
                $pending_appts[] = $appt;
            }

            if($appt->status == 'approved'){
                $approved_appts[] = $appt;
            }

            if($appt->status == 'completed'){
                $completed_appts[] = $appt;
            }
        }

        wp_enqueue_script('ap_script_overview_menu',plugins_url('../static/ap_overview_menu.js',__File__), array('jquery'));

        ?>
        <h1>AppointmentPeach</h1>
        <hr>
        <table class="overview_table">

            <tr>
                <th scope="row" align="left"><label for="customer_title">Call Customers as</label></th>
                <td height="50"><input name="customer_title" style="text-align:center;" type="text" id="customer_title" value="<?= $settings["customer_title"] ?>" class="regular-text" /><button id="update_customer_title_btn" type="button" onclick="to_update();">Update</button></td>
            </tr>
            <tr>
                <th scope="row" align="left"><label for="business_type">Business Type</label></th>
                <td align="center" height="50"><label id="business_type"><?= $settings["business_type"] ?></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="granularity">Granularity</label></th>
                <td align="center" height="50"><label id="granularity"><?= $settings['granularity'] ?>min</label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="customer_count"><?= $customer_title ?> Count</label></th>
                <td align="center" height="50"><label id="customer_count"><?= count($customers) ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="provider_count_active">Active Provider Count</label></th>
                <td align="center" height="50"><label id="provider_count_active"><?= count($active_providers) ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="provider_count_inactive">Inactive Provider Count</label></th>
                <td align="center" height="50"><label id="provider_count_inactive"><?= count($inactive_providers) ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="appointment_count_pending">Pending Appointment Count</label></th>
                <td align="center" height="50"><label id="appointment_count_pending"><?= count($pending_appts) ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="appointment_count_approved">Approved Appointment Count</label></th>
                <td align="center" height="50"><label id="appointment_count_approved"><?= count($approved_appts) ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="appointment_count_completed">Completed Appointment Count</label></th>
                <td align="center" height="50"><label id="appointment_count_completed"><?= count($completed_appts) ?></label></td>
            </tr>

        </table>
        <?php
    });
});
?>
