<?php
/* 
 * �ꎞ�ۑ��p�̐��уf�[�^�x�[�X���猻�݂̃��[�U�[�A�R�[�X�A�A�C�e���ɍ��v����f�[�^�̍��v�_���v�Z����v���O����
 * �Ԃ�l�͍��v�_�A�e���̃^�C�g���Ɠ_��
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
$table = 'Questions';
//�A�C�e��ID
$itemid = optional_param('id', 0, PARAM_INT);

//���p�f�[�^�x�[�X�փA�N�Z�X
$conn = mysqli_connect($address, $user, $pass, $database);
$re = mysqli_query($conn, "SELECT * FROM $table");

//���уf�[�^�x�[�X�փA�N�Z�X
$data = $DB->get_records_sql("SELECT qid, grade FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE $itemid)
							 ORDER BY qid");
while($question = mysqli_fetch_array($re)) {
	$qjson = json_decode($question[1]);
	$titlejson = new stdClass();
	$titlejson->id = $qjson->id;
	$titlejson->title = $qjson->title;
	for ($i = 0; $i < count($data); $i++) {
		//���p�f�[�^�x�[�X�Ɛ��уf�[�^�x�[�X�̌���
		if ($question[0] == $data[$i + 1]->qid) {
			$titlejson->grade = $data[$i + 1]->grade;
		} else {
			$titlejson->grade = "0";
		}
	}
	$result[] = $titlejson;
}

$data = $DB->get_records_sql("SELECT * FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE $itemid)");

$total = 0;
while (count($data) > 0) {
	$total += array_shift($data)->grade;
}

$temp = new stdClass();
$temp->point = $total;

array_unshift($result, $temp);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>