<?php
add_action('wp_ajax_ap_app_get_appt_types',function(){
    global $wpdb;
    $res=$wpdb->get_results('SELECT * FROM ap_appt_types;');
    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_app_get_appt_providers',function(){
    global $wpdb;

    $appt_type_id=intval($_POST['appt_type_id']);

    $provider_ids_by_appt_type=$wpdb->get_results("SELECT provider_id FROM ap_provider_appt_types WHERE appt_type_id=$appt_type_id;");

    $res = [];

    for ($i = 0; $i < count($provider_ids_by_appt_type); $i++) {
        $provider_id = $provider_ids_by_appt_type[$i]->provider_id;
        $provider = new WP_User($provider_id);
        $activated = get_user_meta($provider->ID, 'activated', true);
        $phone = get_user_meta($provider->ID, 'phone', true);
        $location = get_user_meta($provider->ID, 'location', true);
        // remove few fields
        $data = $provider->data;
        $data->user_pass = null;
        $data->user_login = null;
        $data->user_registered = null;
        $data->user_status = null;
        $data->user_activation_key = null;
        $data->active = $activated;
        $data->phone = $phone;
        $data->location = $location;
        $res[] = $data;
    }

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_app_get_provider_time_slots',function(){
    global $wpdb;

    $appt_provider_id=intval($_POST['appt_provider_id']);

    $res=$wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$appt_provider_id};");

    wp_send_json($res);
    wp_die();
});

add_action('wp_ajax_ap_app_new_appt',function(){
    global $wpdb;

    $appt_type_id = $_POST["appt_type"];
    $provider = $_POST["provider"];
    $date = $_POST["date"];
    $time = $_POST["time"];
    $note = $_POST['note'];

    $appt_type = $wpdb->get_row("SELECT * FROM ap_appt_types WHERE appt_type_id={$appt_type_id};");
    $duration = $appt_type->duration;

    $accept = true;
    for ($i = 0; $i < $duration; $i++) {
        $t = $time + $i;
        $s = $wpdb->get_results("SELECT * FROM ap_time_slots WHERE provider_id={$provider} AND time={$t} AND date='{$date}' AND appt_id IS NULL;");
        if (count($s) == 0) {
            $accept = false;
            break;
        }
    }

    if ($accept == true) {
        $wpdb->insert('ap_appointments',
            array(
                'provider_id' => $provider,
                'customer_id' => get_current_user_id(),
                'appt_type_id' => $appt_type_id,
                'status' => 'pending',
                'note' => $note
            )
        );
        $appt_id = $wpdb->insert_id;
        for ($i = 0; $i < $duration; $i++) {
            $t = $time + $i;
            $wpdb->update('ap_time_slots',
                array(
                    'appt_id' => $appt_id
                ),
                array(
                    'provider_id' => $provider,
                    'date' => $date,
                    'time' => $t
                )
            );
        }
//        send_email_for_new_appt($appt_id);
        wp_send_json(array(
            'code' => '0'
        ));
    } else {
        wp_send_json(array(
            'code' => '1'
        ));
    }

    wp_die();
});

function send_email_for_new_appt($appt_id)
{
    global $wpdb;
    $appt = $wpdb->get_row("select * from ap_appointments where appt_id=$appt_id");
    $customer = new WP_User($appt['customer_id']);
    $to = $customer->user_email;
    $subject = 'New Appointment Confirmation';
    $body = "<h1>Confirmation for You New Appointment: $appt_id</h1>";
    $headers = array('Content-Type: text/html; charset=UTF-8');
    wp_mail( $to, $subject, $body, $headers );
}

add_shortcode(
    'appointment_peach',
    function () {
        if (is_user_logged_in()) {
            $user = wp_get_current_user();
            if (!in_array( 'subscriber', (array) $user->roles ) ) {
                return;
            }
            $settings = get_option('wp_custom_appointment_peach');

            wp_enqueue_style('ap_style_dialog_box', plugins_url("../static/dialog_box.css",__File__));
            wp_enqueue_style('ap_style_app', plugins_url('../static/app.css', __FILE__));

            wp_enqueue_script('ap_script_react', plugins_url("../lib/js/react-with-addons.min.js", __File__));
            wp_enqueue_script('ap_script_react_dom', plugins_url("../lib/js/react-dom.min.js", __File__));
            wp_enqueue_script('ap_script_dialog_box',plugins_url('../static/dialog_box.js',__File__), array('jquery'));
            wp_enqueue_script('ap_script_app', plugins_url('../static/app.js', __FILE__), array('jquery'));
            wp_localize_script('ap_script_app', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
            wp_localize_script('ap_script_app', 'settings', $settings);

            ?>
            <div id="ap">
            </div>
            <?php
        } else {
            ?>
            <div>
                <label>You need to login to make appointment.</label>
                <?php wp_login_form();?>
                <button onclick="location.href='<?php echo wp_registration_url();?>'">
                    Register
                </button>
            </div>
            <?php
        }
    }
);
?>