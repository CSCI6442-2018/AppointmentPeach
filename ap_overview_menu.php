<?php
add_action('admin_menu', function(){
    add_menu_page("Business Administrator","AppointmentPeach","manage_options","overview",function(){
        ?>
        <h1>AppointmentPeach</h1>
        <?php
    });
});
?>
