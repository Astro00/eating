<?php

header("Content-Type:application/json");

$start = $_REQUEST['start'];
if(empty($start))
{
    $start = 0;
}

$count = 5;
$output = [];

$conn = mysqli_connect('127.0.0.1','root','','kaifanla');

$sql = "SET NAMES UTF8";

mysqli_query($conn,$sql);

$sql = "SELECT did,price,name,img_sm,material FROM kf_dish LIMIT $start,$count";

$result = mysqli_query($conn,$sql);

while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);

?>