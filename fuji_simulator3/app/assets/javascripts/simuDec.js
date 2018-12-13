//変数を宣言するファイル

$(function() {
  //変数の定義
  if ( typeof NS === "undefined" ) NS = {};

  // nsf-all var
  NS.pcNode = 0;  // PCの数
  NS.ruNode = 0;  // Routerの数
  NS.busNode = 0; //busの数
  NS.swNode = 0;  // Switchの数
  NS.svNode = 0;  // Serverの数
  NS.lanNode = 0; // LanNodeの数

  // nsf-main var
  NS.mainDropFlg     = true; // Draggableのフラグ
  NS.dropNodeInt     = 0;    // DropNodeの個数
  NS.dropNodeName    = "";   // DropNodeの名前
  NS.dropContextName = "";   // DropNodeのContextMenuの名前

  // nsf-canvas var
  NS.points          = []; // ドラッグ時のマウスの座標の配列
  NS.lanArrClass     = []; // nsf-main-canvasのクラスの配列
  NS.lanArrWidth     = []; // LANの帯域幅の配列
  NS.lanWidth        = 2;  // LANの幅
  NS.lanFlag         = false;  // LANのフラグ   (画像に乗っているとき)
  NS.busFlag        = false;
  NS.busDrawFrag    = false;
  NS.lanFlaglink;          // LANのフラグ2  (lanLinkがあるとき)
  NS.lanFlagPoint;         // LANのフラグ3  (lanDownが実行されたとき)
  NS.lanFlagDelet;         // LANのフラグ4  (lanDownの削除するとき)
  NS.lanFlagMove;          // LANのフラグ5  (lanMoveDownが実行されたとき)
  NS.elLanMoveThis;        // LANMoveのクエリのキャッシュ
  NS.addCtx;               // 追加したCanvasのAPIにアクセスできるオブジェクト
  NS.addCanvas;            // 追加したCanvasを格納
  NS.canvasWidth      = $('#nsf-main').width();  // nsf-mainの幅
  NS.canvasHeight     = $('#nsf-main').height(); // nsf-mainの高さ
  NS.mainCanvasWidth  = $('#nsf-main-canvas')[0].getBoundingClientRect().left - 35;
  NS.mainCanvasHeight = $('#nsf-main-canvas')[0].getBoundingClientRect().top - 35;
  NS.mainCanvasX      = $('#nsf-main-canvas')[0].getBoundingClientRect().left;
  NS.mainCanvasY      = $('#nsf-main-canvas')[0].getBoundingClientRect().top;
  NS.questionCanvasX  = $('#nsf-main-canvas')[0].getBoundingClientRect().left + 150;
  NS.questionCanvasY  = $('#nsf-main-canvas')[0].getBoundingClientRect().top + 60;
  NS.mainCtx          = $('#nsf-main-canvas')[0].getContext('2d'); // nsf-main-canvasをAPIにアクセスできるオブジェクト
  NS.mainCtx.strokeStyle = '#2fb9fe';                              // 線の色を青色に設定

  // nsf-glay var
  NS.bGlayFladg = false; // glayLayerのフラグ

  //animecanvasのフラグ
  NS.animecanvasFlag = false;

  //urlパラメータを取得
  var arg = new Object;
  var pair=location.search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      NS.urlparameter=kv[1];
  }

  //nsf-mainのxy
  $('#nsf-main-canvas').attr('data-x', NS.mainCanvasWidth);
  $('#nsf-main-canvas').attr('data-y', NS.mainCanvasHeight);
});
