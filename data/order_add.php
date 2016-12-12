<?php
header('Content-Type:application/json');

@$user_name = @$_REQUEST['user_name'];
@$phone = @$_REQUEST['phone'];
@$sex = @$_REQUEST['sex'];
@$addr = @$_REQUEST['addr'];
@$did = @$_REQUEST['did'];
$order_time = time();
if(empty($user_name) || empty($phone) || empty($sex) || empty($addr)|| empty($did))
{
    echo '[]';
    return;
}

$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql = "INSERT INTO kf_order VALUES(NULL,'$phone','$user_name','$sex','$order_time','$addr','$did')";
$result = mysqli_query($conn,$sql);

$output = [];
if($result)
{
    $output['oid'] = mysqli_insert_id( $conn );
    $output['msg'] = 'succ';
}
else
{
    $output['msg'] = 'err';
}
echo json_encode($output);

?>
