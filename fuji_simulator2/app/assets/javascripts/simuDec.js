//変数を宣言するファイル
$(function() {




  //変数の定義
  //空のオブジェクトを作成
  if (typeof NS === "undefined") NS = {};

  NS.testflag = false;

  NS.dropContextName;

  //全体
  NS.pcNode = 0;
  NS.ruNode = 0;
  NS.busNode = 0;
  NS.swNode = 0;
  NS.svNode = 0;
  NS.lanNode = 0;

  //main部分の変数
  NS.mainDropFlg = true; //draggableのフラグ
  NS.dropNodeInt = 0;
  NS.dropNodeName = "";
  NS.dropContextName = "";


  //canvasに関する
  NS.points           = []; //ドラッグ時のマウスの座標の配列
  NS.lanArrClass      = []; //ns_main_canvasのクラスの配列
  NS.lanWidth         = 2;  //LANの幅
  NS.canvasWidth      = $('#ns_main').width(); //ns_mainの幅
  NS.canvasHeight     = $('#ns_main').height(); //ns_mainの高さ
  console.log("canvasHeight: " + NS.canvasHeight);

  NS.mainCanvasWidth  = $('#ns_main_canvas')[0].getBoundingClientRect().left;
  console.log("canvas確認: " + NS.mainCanvasWidth);
  NS.mainCanvasHeight = $('#ns_main_canvas')[0].getBoundingClientRect().top;

  NS.elLanMoveThis;
  NS.addCtx;  //追加したCanvasのAPIにアクセスできるオブジェクト
  NS.addCanvas; //追加したCanvasを格納

  NS.mainCtx = $('#ns_main_canvas')[0].getContext('2d'); //ns_main_canvasをAPIにアクセスできるオブジェクト
  NS.mainCtx.strokeStyle = 'red';

  $('#ns_main_canvas').attr('data-x', NS.mainCanvasWidth);
  $('#ns-main-canvas').attr('data-y', NS.mainCanvasHeight);



  NS.lanFlag = false; //LAN画像のonとoffに関するフラグ
  NS.lanLinkFlag; //
  NS.lanPointFlag;
  NS.lanDeleteFlag;
  NS.lanMoveFlag;

});
