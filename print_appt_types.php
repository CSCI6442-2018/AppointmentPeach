<?php
require_once('../../../wp-load.php');

require('table_to_pdf.php');

$res=$wpdb->get_results('SELECT * FROM ap_appt_types;');

table_to_pdf($res,array('ID','Title','Description','Icon','Length'));
?>