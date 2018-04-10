<?php
require('./lib/fpdf.php');

/*pdf*/
function table_to_pdf($result,$header){
    $pdf=new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Arial','B',11);
    foreach($header as $heading){
        $pdf->Cell(35,10,$heading,1);
    }
    foreach ($result as $row) {
        $pdf->SetFont('Arial','',9);
        $pdf->ln();
        foreach ($row as $column) {
            $pdf->Cell(35,10,$column,1);
        }
    }
    $pdf->Output();
}

$table=$_GET["table"];

$COLS=[
    "ap_locations"=>["name"],
    "ap_users"=>["user_id","location","phone","role"],
    "ap_time_slots"=>["provider_id","date","time","appt_id"],
    "ap_appt_types"=>["id","title","description","time"],
    "ap_appointments"=>["id","provider_id","customer_id","appt_type_id","status"],
    "ap_provider_appt_types"=>["provider_id","appt_type_id"]
];

require_once('../../../wp-load.php');

$res=$wpdb->get_results("SELECT * FROM $table;");

table_to_pdf($res,$COLS[$table]);
?>