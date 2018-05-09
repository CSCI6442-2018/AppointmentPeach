<?php
add_action('admin_menu', function () {
    add_menu_page("Business Administrator", "AppointmentPeach", "ap_business_administrator", "overview", function () {

        global $wpdb;

        $settings = get_option('wp_custom_appointment_peach');
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

        ?>
        <h1>AppointmentPeach</h1>
        <hr>
        <p>Business type: <?= array(
                "dental" => "Dental"
            )[$settings["business_type"]] ?></p>
        <p>Granularity: <?= $settings["granularity"] ?></p>
        <hr>
        <p>Customers: <?= count($customers); ?></p>
        <p>Active providers: <?= count($active_providers) ?></p>
        <p>Inactive providers: <?= count($inactive_providers) ?></p>
        <hr>
        <p>Active appointment types: <?= count($active_appt_types) ?></p>
        <p>Inactive appointment types: <?= count($inactive_appt_types) ?></p>
        <hr>
        <p>Pending appointments: <?= count($pending_appts) ?></p>
        <p>Approved appointments: <?= count($approved_appts) ?></p>
        <p>Completed appointments: <?= count($completed_appts) ?></p>
        <?php
    });
});
?>
