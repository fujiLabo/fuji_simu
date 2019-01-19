<?PHP
/*
 * ゲストユーザーのためのデータベース掃除プログラム
 */

  $address = 'localhost';
  $user = 'root';
  $pass = 'Td;Rk;Fk;';
  $database = 'e-learning';
  $table = 'save';

  $conn = mysqli_connect($address, $user, $pass, $database);
  if ($conn) {
    $sql_result = mysqli_query($conn, "DELETE FROM $table WHERE userid = '1'");
  } else {
    echo NULL;
  }
?>
