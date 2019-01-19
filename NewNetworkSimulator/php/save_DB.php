<?PHP
require_once(dirname(dirname(dirname(__FILE__))).'/moodle/config.php');

$json = required_param('jsonsaveData', PARAM_RAW);
$save = json_decode($json);
$save->userid = $USER->id;

$address = 'localhost';
$user = 'root';
$pass = 'Td;Rk;Fk;';
$database = 'e-learning';
$table = 'save';

var_dump($save);

$conn = mysqli_connect($address, $user, $pass, $database);
if ($conn) {
  mysqli_query($conn, "INSERT $table INTO (userid, qid, json) VALUE ($USER->id, $save->id, $save->json)");
} else {
  echo NULL;
}
?>