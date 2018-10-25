//変数を宣言するファイル
$(function(){

//変数の定義
//空のオブジェクトを作成
if ( typeof NS === "undefined" ) NS = {};

NS.pcNode = 0;

NS.mainDropFlg = true; //draggableのフラグ

//canvasに関する
NS.points       = []; //ドラッグ時のマウスの座標の配列
NS.canvasWidth  = $('#ns_main').width(); //ns_mainの幅
NS.canvasHeight = $('#ns_main').height(); //ns_mainの高さ
console.log("canvasHeight: " + NS.canvasHeight);

var canvas = document.getElementById('ns_main_canvas');


//var test = $('#ns_main_canvas')[0].getBoundingClientRect().left - 35;
NS.mainCtx      = $('#ns_main_canvas')[0].getContext('2d'); //ns_main_canvasをAPIにアクセスできるオブジェクト

$('#ns_main_canvas').attr('data-x', NS.mainCanvasWidth);
$('#ns-main-canvas').attr('data-y', NS.mainCanvasHeight);



NS.lanFlag = false; //LAN画像のonとoffに関するフラグ

});
