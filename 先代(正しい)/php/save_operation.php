<?PHP
/*
 * �����ۑ�����v���O����
 */

require_once(dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/config.php');

//�f�[�^�x�[�X��������擾
//�ڑ���̃A�h���X
$address = 'localhost';
//MySQL�̃��[�U�[��
$user = 'root';
//MySQL��pass
$pass = 'Td;Rk;Fk;';
//�f�[�^�x�[�X��
$database = 'e-learning';
//�e�[�u����
$table = 'operation';
//�A�C�e��ID
$itemid = $_POST['id'];

$json = $_POST['postJsonData'];
$json = str_replace('\\', "\\\\", $json);

//���p�f�[�^�x�[�X�փA�N�Z�X
$conn = mysqli_connect($address, $user, $pass, $database);
if ($conn) {
  // ���R�[�h���Ȃ�������INSERT�A��������UPDATE����
  $sql_result = mysqli_query($conn, "INSERT INTO $table (userid, itemid, json) VALUES ($USER->id, $itemid, '$json')");
} else {
  echo NULL;
}
mysqli_close($conn);
?>
