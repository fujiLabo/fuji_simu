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
$gradesbase = 'e-learning';
//�e�[�u����
$table = 'Questions';
//�A�C�e��ID
$itemid = $_POST['id'];
//optional_param('id', 0, PARAM_INT);

//���p�f�[�^�x�[�X�փA�N�Z�X
$conn = mysqli_connect($address, $user, $pass, $gradesbase);
$re = mysqli_query($conn, "SELECT * FROM $table");

//���уf�[�^�x�[�X�փA�N�Z�X
$grades = $DB->get_records_sql("SELECT qid, grade FROM {networksimmod_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (networksimmod LIKE '$itemid')
							 ORDER BY qid");

$total = 0;
$result = array();
while($question = mysqli_fetch_array($re)) {
	$qjson = json_decode($question[1]);
	$gradejson = new stdClass();
	$gradejson->id = $qjson->id;
	$gradejson->title = $qjson->title;
	$gradejson->grade = "0";
	$gradejson->point = $qjson->point;
	foreach($grades as $element) {
		//���p�f�[�^�x�[�X�Ɛ��уf�[�^�x�[�X�̌���
		if ($question[0] == $element->qid) {
			$gradejson->grade = $element->grade;
			if ($element->grade * $qjson->point > 0) {
				$total += $element->grade * $qjson->point;
			}
			break;
		}
	}
	$result[] = $gradejson;
}

$pointjson = new stdClass();
$pointjson->point = $total;
//$result["points"] = $total;
array_unshift($result, $pointjson);

//�Ώۃ��[�U�[�̐��уf�[�^�x�[�XID������
$data = $DB->get_records_sql("SELECT * FROM {grade_grades}
							 WHERE (userid LIKE $USER->id)
							 AND (itemid LIKE $itemid)");
$obj = array_shift($data);

$update = new stdClass();
$update->id = $obj->id;
$update->finalgrade = $total;
$update->timemodified = time();
$DB->update_record('grade_grades', $update, false);

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>