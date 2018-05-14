<?php

add_action('wp_ajax_ap_setup', 'setup');

function setup()
{
    $business_type = $_POST['business_type'];
    $granularity = $_POST['granularity'];

    $options = get_option('wp_custom_appointment_peach');
    $installed = $options['installed'];
    if ($installed) {
        wp_send_json(['status' => false, 'message' => 'save failed!']);
    }

    $business_type_entity = $options['business_types'][$business_type];
    $options['business_type'] = $business_type_entity['title'];
    $options['icon_url'] = $business_type_entity['icon_url'];
    $options['customer_title'] = $business_type_entity['customer_title'];
    $options['granularity'] = $granularity;
    $options['installed'] = true;
    update_option('wp_custom_appointment_peach', $options);
    wp_send_json(['status' => true, 'href' => admin_url(), 'message' => 'save succeeded!']);
    wp_die();
}

function instruction_menu_page_html()
{
    common_html()
    ?>
    <hr>
    <h2>Settings</h2>
    <h3>Settings have been saved.</h3>
    <?php
}

function common_html(){
    ?>
    <h1>AppointmentPeach</h1>
    <hr>
    <p>
    <h2>Use</h2>
    <h3>For Installers(Website Administrator)</h3>
    <div>
        <p>
            You can add the shortcode [appointment_peach] to any of the pages and posts, then the users will be able to make
            appointments through the plugin.
        </p>
        <p>
            As installer, you need to setup the plugin after activation, once the setup is submitted, you can no longer change the settings.
            Business Administrator and Provider can access the admin pages only after the installer has finished the setup.
        </p>
    </div>
    <h3>For Business Administrators</h3>
    <div>
        Please first sign in as Business Administrator, the service management pages are located in the admin panel.
        The Business Administrators can manage all the providers, appointments and appointment types.
    </div>
    <h3>For Providers</h3>
    <div>
        Please first sign in as Provider, then you will be able to access and manage your appointments in the admin panel.
    </div>
    <h3>For Customers</h3>
    <div>
        Customers will need to sign in to make appointments, they can also manage their appointments in the admin panel.
    </div>
    <?php
}

function setup_menu_page_html()
{
    $options = get_option('wp_custom_appointment_peach');
    wp_enqueue_style('ap_style_ap_base', plugins_url("../static/set/css/base.css", __File__));
    wp_enqueue_style('ap_style_setup_menu', plugins_url("../static/set/css/setup.css", __File__));
    wp_enqueue_script('ap_script_setup_menu', plugins_url('../static/set/js/setup.js', __File__), array('jquery'));
    wp_localize_script('ap_script_setup_menu', 'options', $options);
    common_html()
    ?>
    <hr>
    <h2>Settings</h2>
    <div id="setup_form_container">

        <table class="setup_table">

            <tr>
                <th scope="row" align="left"><label for="granularity">Granularity</label></th>
                <td height="50"><input name="granularity" style="text-align:center;" type="text" id="granularity"
                                       value="<?= $options['granularity'] ?>" class="regular-text"/></td>
                <td height="50" align="center">0 ~ 60</td>
            </tr>
            <tr>
                <th scope="row" align="left"><label for="business_type">Business Type</label></th>
                <td height="50">
                    <div id="business_type_list"></div>
                </td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="customer_title">Customer Title</label></th>
                <td align="center" height="50"><label id="customer_title"><?= $options['customer_title'] ?></label></td>
            </tr>

            <tr>
                <th scope="row" align="left"><label for="icon">ICON</label></th>
                <td align="center" height="50"><img id="icon" height="80" src="<?= $options['icon_url'] ?>"/></td>
            </tr>

            <tr>
                <th scope="row" align="left" height="50">
                    <button type="button" onclick="to_update();">Confirm</button>
                </th>
            </tr>
        </table>
    </div>
    <?php
}