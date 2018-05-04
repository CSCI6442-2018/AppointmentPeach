<?php
add_action('admin_menu', function(){
    add_menu_page("Business Administrator","AppointmentPeach","ap_business_administrator","overview",function(){
        ?>
        <h1>AppointmentPeach</h1>
        <?php
    });
});
?>
