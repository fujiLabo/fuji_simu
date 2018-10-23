//変数を宣言するファイル


//変数の定義
//空のオブジェクトを作成
if ( typeof NS === "undefined" ) NS = {};

NS.pcNode = 0;

NS.mainDropFlg = true; //draggableのフラグ

//canvasに関する
NS.points       = []; //ドラッグ時のマウスの座標の配列
NS.canvasWidth  = $('ns_main').width(); //ns_mainの幅
NS.canvasHeight = $('ns_main').height(); //ns_mainの高さ


NS.lanFlag = false; //LAN画像のonとoffに関するフラグ
