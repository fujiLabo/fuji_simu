//変数を宣言するファイル
//(?) ← これいる？
$(function() {




  //変数の定義
  //空のオブジェクトを作成
  if (typeof NS === "undefined") NS = {};

  NS.testflag = false;

  NS.dropContextName;

  //全体
  NS.pcNode = 0;  //PCの数
  NS.ruNode = 0;  //Routerの数
  NS.busNode = 0; //busの数
  NS.swNode = 0;  //Switchの数
  NS.svNode = 0;  //Serverの数
  NS.lanNode = 0; //LanNodeの数

  //main部分の変数
  NS.mainDropFlag = true;    //draggableのフラグ
  NS.dropNodeInt = 0;       //DropNodeの個数
  NS.dropName = "";         //dropした画像のクラスの名前
  NS.dropNodeName = "";     //DropNodeの名前
  NS.dropContextName = "";  //DropNodeのContextMenuの名前(?)


  //canvas(描画)に関する
  NS.points           = [];   //ドラッグ時のマウスの座標の配列
  NS.lanArrClass      = [];   //ns_main_canvasのクラスの配列
  NS.lanArrWidth      = [];   //LANの帯域幅の配列
  NS.lanWidth         = 2;    //LANの幅
  NS.elLanMoveThis;
  NS.addCtx;  //追加したCanvasのAPIにアクセスできるオブジェクト
  NS.addCanvas; //追加したCanvasを格納
  NS.canvasWidth      = $('#ns_main').width();  //ns_mainの幅
  NS.canvasHeight     = $('#ns_main').height();  //ns_mainの高さ
  NS.mainCanvasWidth  = $('#ns_main_canvas')[0].getBoundingClientRect().left -35;
  NS.mainCanvasHeight = $('#ns_main_canvas')[0].getBoundingClientRect().top - 35;
  NS.mainCanvasX      = $('#ns_main_canvas')[0].getBoundingClientRect().left;
  NS.mainCanvasY      = $('#ns_main_canvas')[0].getBoundingClientRect().top;
  NS.questionCanvasX  = $('#ns_main_canvas')[0].getBoundingClientRect().left + 150;
  NS.questionCanvasY  = $('#ns_main_canvas')[0].getBoundingClientRect().top + 60;
  NS.mainCtx = $('#ns_main_canvas')[0].getContext('2d'); //ns_main_canvasをAPIにアクセスできるオブジェクト
  NS.mainCtx.strokeStyle = 'red';
  NS.addCanvas = $('<canvas width = ' + NS.canvasWidth + ' height = ' + NS.canvasHeight + '></canvas>').prependTo('#ns_main'); //追加したCanvasを格納
  NS.addCtx;  //追加したCanvasのAPIにアクセスできるオブジェクト  
  //canvasに関するフラグ
  NS.imgFlag = false;       //マウスが画像の上にあるかどうか
  NS.lanFlag = false;       //LANモードのonとoff
  NS.busFlag = false;
  NS.busDrawFrag = false;
  NS.lanLinkFlag;           //lanLinkがあるとき
  NS.lanPointFlag;          //lanDownが実行されたとき
  NS.lanDeleteFlag;         //lanDownを削除するとき
  NS.lanMoveFlag;           //lanMoveDownが実行されたとき


  //ns_mainのxy
  $('#ns_main_canvas').attr('data-x', NS.mainCanvasWidth);
  $('#ns-main-canvas').attr('data-y', NS.mainCanvasHeight);

});
