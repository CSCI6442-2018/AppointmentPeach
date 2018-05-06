<?php
add_action('admin_menu', function(){
    add_menu_page("Business Administrator","AppointmentPeach","manage_options","overview",function(){

        global $wpdb;

        $s=$wpdb->get_results("SELECT * FROM ap_settings;");
        $settings=[];
        for($i=0;$i<count($s);$i++){
            $settings[$s[$i]->key]=$s[$i]->value;
        }

        $customers=$wpdb->get_results("SELECT * from ap_users WHERE role='customer';");
        $active_providers=$wpdb->get_results("SELECT * from ap_users WHERE role='provider' AND active=1;");
        $inctive_providers=$wpdb->get_results("SELECT * from ap_users WHERE role='provider' AND active=0;");

        $active_appt_types=$wpdb->get_results("SELECT * from ap_appt_types WHERE active=1;");
        $inactive_appt_types=$wpdb->get_results("SELECT * from ap_appt_types WHERE active=0;");

        $pending_appts=$wpdb->get_results("SELECT * from ap_appointments WHERE status='pending';");
        $approved_appts=$wpdb->get_results("SELECT * from ap_appointments WHERE status='approved';");
        $completed_appts=$wpdb->get_results("SELECT * from ap_appointments WHERE status='completed';");

        ?>
        <h1>AppointmentPeach</h1>
        <hr>
        <p>Business type: <?=array(
            "dental"=>"Dental"
        )[$settings["business_type"]]?></p>
        <p>Granularity: <?=$settings["granularity"]?></p>
        <hr>
        <p>Customers: <?=count($customers);?></p>
        <p>Active providers: <?=count($active_providers)?></p>
        <p>Inactive providers: <?=count($inctive_providers)?></p>
        <hr>
        <p>Active appointment types: <?=count($active_appt_types)?></p>
        <p>Inactive appointment types: <?=count($inactive_appt_types)?></p>
        <hr>
        <p>Pending appointments: <?=count($pending_appts)?></p>
        <p>Approved appointments: <?=count($approved_appts)?></p>
        <p>Completed appointments: <?=count($completed_appts)?></p>
        <?php
    });
});
?>
