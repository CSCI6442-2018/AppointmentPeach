<?php
require('./fpdf.php');

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
?>