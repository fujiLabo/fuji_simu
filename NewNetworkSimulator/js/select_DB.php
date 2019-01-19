<?php
$id = $_POST['question_id'];
$text = '{"data":[{"name":"PC0","ip":"","sm":"24","coordinateX":50,"coordinateY":47},{"name":"PC1","ip":"","sm":"24","coordinateX":400,"coordinateY":100},{"name":"Router0","ip1":"","ip2":"","sm1":"24","sm2":"24","nha":"","coordinateX":200,"coordinateY":100}],"pair":["0-2","1-2"],"id":"1","text":"a"}';
echo $text;

/*
{
 "id": 1,
 "text": "test",
 "data": [
  {
   "name": "PC0",
   "coordinateX": 50,
   "coordinateY": 100
  },
  {
   "name": "Router0",
   "coordinateX": 70,
   "coordinateY": 100
  },
  {
   "name": "PC1",
   "coordinateX": 100,
   "coordinateY": 100
  }
 ],
 "pair": [
  "0-1",
  "1-2"
 ]
}
*/


?>
