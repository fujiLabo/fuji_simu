<?php
//statからPOSTされたデータを取得
$_JsonPostData = $_POST['postData'];
//$_FileNum = $_POST['filenum'];
//$rubycommand = 'ruby test.rb' + $_FileNum;

//jsonの情報をファイルに出力
$fp = fopen("/NewNetworkSimulator/study/test.json", "w+");
fwrite($fp, $_JsonPostData);
fclose($fp);

//ネットワーク診断を実行(rubyのプログラム実行)
$check = system('ruby net_check.rb');


?>
