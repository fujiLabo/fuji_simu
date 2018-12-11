//変数を宣言するファイル

$(function() {
  //変数の定義
  if ( typeof NSF === "undefined" ) NSF = {};

  // nsf-all var
  NSF.pcNode = 0;  // PCの数
  NSF.ruNode = 0;  // Routerの数
  NSF.busNode = 0; //busの数
  NSF.swNode = 0;  // Switchの数
  NSF.svNode = 0;  // Serverの数
  NSF.lanNode = 0; // LanNodeの数

  // nsf-main var
  NSF.mainDropFlg     = true; // Draggableのフラグ
  NSF.dropNodeInt     = 0;    // DropNodeの個数
  NSF.dropNodeName    = "";   // DropNodeの名前
  NSF.dropContextName = "";   // DropNodeのContextMenuの名前

  // nsf-canvas var
  NSF.points          = []; // ドラッグ時のマウスの座標の配列
  NSF.lanArrClass     = []; // nsf-main-canvasのクラスの配列
  NSF.lanArrWidth     = []; // LANの帯域幅の配列
  NSF.lanWidth        = 2;  // LANの幅
  NSF.lanFlag         = false;  // LANのフラグ   (画像に乗っているとき)
  NSF.busFlag        = false;
  NSF.busDrawFrag    = false;
  NSF.lanFlaglink;          // LANのフラグ2  (lanLinkがあるとき)
  NSF.lanFlagPoint;         // LANのフラグ3  (lanDownが実行されたとき)
  NSF.lanFlagDelet;         // LANのフラグ4  (lanDownの削除するとき)
  NSF.lanFlagMove;          // LANのフラグ5  (lanMoveDownが実行されたとき)
  NSF.elLanMoveThis;        // LANMoveのクエリのキャッシュ
  NSF.addCtx;               // 追加したCanvasのAPIにアクセスできるオブジェクト
  NSF.addCanvas;            // 追加したCanvasを格納
  NSF.canvasWidth      = $('#nsf-main').width();  // nsf-mainの幅
  NSF.canvasHeight     = $('#nsf-main').height(); // nsf-mainの高さ
  NSF.mainCanvasWidth  = $('#nsf-main-canvas')[0].getBoundingClientRect().left - 35;
  NSF.mainCanvasHeight = $('#nsf-main-canvas')[0].getBoundingClientRect().top - 35;
  NSF.mainCanvasX      = $('#nsf-main-canvas')[0].getBoundingClientRect().left;
  NSF.mainCanvasY      = $('#nsf-main-canvas')[0].getBoundingClientRect().top;
  NSF.questionCanvasX  = $('#nsf-main-canvas')[0].getBoundingClientRect().left + 150;
  NSF.questionCanvasY  = $('#nsf-main-canvas')[0].getBoundingClientRect().top + 60;
  NSF.mainCtx          = $('#nsf-main-canvas')[0].getContext('2d'); // nsf-main-canvasをAPIにアクセスできるオブジェクト
  NSF.mainCtx.strokeStyle = '#2fb9fe';                              // 線の色を青色に設定

  // nsf-glay var
  NSF.bGlayFladg = false; // glayLayerのフラグ

  //animecanvasのフラグ
  NSF.animecanvasFlag = false;

  //urlパラメータを取得
  var arg = new Object;
  var pair=location.search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      NSF.urlparameter=kv[1];
  }

  //nsf-mainのxy
  $('#nsf-main-canvas').attr('data-x', NSF.mainCanvasWidth);
  $('#nsf-main-canvas').attr('data-y', NSF.mainCanvasHeight);
});
