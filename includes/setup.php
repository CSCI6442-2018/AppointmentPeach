<?php

add_action('wp_ajax_ap_setup', 'setup');

function setup()
{
    $business_type = $_POST['business_type'];
    $granularity = $_POST['granularity'];

    $options = get_option('wp_custom_appointment_peach');
    $installed = $options['installed'];
    if($installed){
        wp_send_json(['status' => false, 'message'=>'save failed!']);
    }

    $business_type_entity = $options['business_types'][$business_type];
    $options['business_type'] = $business_type_entity['title'];
    $options['icon_url'] = $business_type_entity['icon_url'];
    $options['customer_title'] = $business_type_entity['customer_title'];
    $options['granularity'] = $granularity;
    $options['installed'] = true;
    update_option('wp_custom_appointment_peach', $options);
    wp_send_json(['status' => true, 'href' => admin_url(), 'message'=>'save succeeded!']);
    wp_die();
}

function setup_menu_page_html()
{
    $options = get_option('wp_custom_appointment_peach');
    wp_enqueue_style('ap_style_setup_menu', plugins_url("../static/set/css/setup.css", __File__));
    wp_enqueue_script('ap_script_setup_menu', plugins_url('../static/set/js/setup.js', __File__), array('jquery'));
    wp_localize_script('ap_script_setup_menu', 'options', $options);
    ?>
    <h1>AppointmentPeach</h1>
    <hr>
    <div id="setup_form_container">

        <table class="setup_table">

            <tr>
                <th scope="row" align="left"><label for="granularity">Granularity</label></th>
                <td height="50"><input name="granularity" style="text-align:center;" type="text" id="granularity" value="<?= $options['granularity'] ?>" class="regular-text" /></td>
            </tr>
            <tr>
                <th scope="row" align="left"><label for="business_type">Business Type</label></th>
                <td height="50"><input name="business_type" style="text-align:center;" type="text" id="business_type" value="<?= $options['business_type'] ?>" class="regular-text" /></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="customer_title">Call Customers as</label></th>
                <td align="center" height="50"><label id="customer_title"><?= $options['customer_title'] ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="icon_url">icon</label></th>
                <td align="center" height="50"><label id="icon_url"><?= $options['icon_url'] ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"> </th>
                <td align="center" height="50"><button type="button" onclick="to_update();">Confirm</button></td>
            </tr>
        </table>
    </div>
    <?php
}