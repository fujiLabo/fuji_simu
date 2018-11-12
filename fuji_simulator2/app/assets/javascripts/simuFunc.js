//simuMainで使用する関数等のファイル


  //独自の右クリック作成
  function fncontextmenu(element) {
    console.log(element);

    //後で変える(試し)(現在未使用)
    var menuName;
    var selectorType = NS.dropContextName;
    if (selectorType === "dropPC"){
      menuName = "#contextPC";
    }else{
      menuName = "#contextRouter";
    }

    $.contextMenu('destroy');

    $.contextMenu({
      //selector: '.' + NS.dropContextName,
      //items: $.contextMenu.fromMenu($(menuName)),
      selector: ".dropMachine",
      items: $.contextMenu.fromMenu($("#contextPC")),
    });
  }
  //この書き方でも一応右クリックできた(ダブルクリックにするならこれ？)
  //$(document).on('contextmenu', '.dropMachine', function() { });




  /*
  //読み込み時のアニメーション ()
  $().introtzikas({
    line: '#fff', //ラインの色
    speedwidth: 1000, //幅の移動完了スピード
    speedheight: 1000, //高さの移動完了スピード
    bg: '#333' //背景色
  });
  */

  //画像をmain部分にドロップする際の関数
  fnMainDrop = function(ui, obj) {
    //ドロップした種類の判別
    console.log("contextname: " + ui.draggable.attr("id"));
    if (ui.draggable.attr("id") === "PC"){
      console.log("PC");
      NS.dropNodeInt = NS.pcNode;
      NS.dropNodeName = "PC" + NS.pcNode;
      NS.dropContextName = "contextmenuPC";
      NS.pcNode++;
      console.log("nodename: " + NS.dropNodeName);
    }else if (ui.draggable.attr("id") === "Router"){
      console.log("Router");
      NS.dropNodeInt = NS.ruNode;
      NS.dropNodeName = "Router" + NS.ruNode;
      NS.dropContextName = "contextmenuRouter";
      NS.ruNode++;
    }

    //ドロップした画像を追加
    $('#ns_main').append(
      $('<img>').attr({
        src: ui.draggable.attr('src'),
        alt: NS.dropNodeName,
        class: "dropMachine",
        'data_ifnum': 0,
        'data_lan_if': '',
        'data_routingtable_num': 0,
        'data_link_num': 0,
        id: NS.dropNodeName,
        style: "position: absolute; top: " + ui.offset.top + "px; left: " + ui.offset.left + "px",

      })
    );
    console.log("alt(before): " + NS.dropNodeName);
    console.log("alt: " + ui.draggable.attr("alt"));
    //ドロップした画像に右クリックの属性をつける
    $("#ns_main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');


    //mainにドロップされたものをドラッグ可能に(オプションによってmain内でのみに移動を限定する必要あり)
    $('#ns_main img:last-child').draggable({

    });

    //ドロップした際にLANモードがonならば、ドラッグを不可にする
    if (NS.lanFlag){
      $('#ns_main img:last-child').draggable('disable');
      $('#ns_main img:last-child').mouseup(function(e) {e.preventDefault(e); });
      $('#ns_main img:last-child').mousedown(function(e) {e.preventDefault(e); });
    }
    //changeDrag();

    //ns_rightにトポロジを追加
    $("#ns_right dl").append("<dt><img src = /assets/plus.jpg><span>" + $("#ns_main img:last-child").attr("alt") + "</span></dt>");
    if (ui.draggable.attr("id") === "PC"){
      console.log("draggable: " + ui.draggable.attr("class"));
    }else if (ui.draggable.attr("id") === "Router"){

    }
  }

  //線の描画
  fnLanDraw = function() {
    if ($('#ns_main_canvas').attr('class') != '') {

    }

    lanNum = $('#ns_main_canvas').attr('class').split(' ');
    console.log("lanNum: " + lanNum);
    console.log("lanNum.length: " + lanNum.length);
  }

//   //マウスが移動した際の処理
//   fnLanDrag = function(e) {
//     NS.addCtx = NS.addCanvas.get(0).getContext('2d');
//     NS.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
//     NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
//     NS.addCtx.beginPath();
//
//     //線の色の変更()
//     NS.addCtx.strokeStyle = '#2fb9fe';
//
//     NS.addCtx.lineWidth = NS.lanWidth;
//     NS.addCtx.moveTo(NS.points[0].x, NS.points[0].y);
//     NS.addCtx.lineTo(NS.points[NS.points.length - 1].x, NS.points[NS.points.length - 1].y);
//     NS.addCtx.stroke();
//   }
//   //描画セット
//   fnDraw = function() {
//     //NS.fnIfDraw();
//     NS.fnLanDraw();
//     //NS.fnNameDraw();
//   }
//
//
//   //マウスのボタンが押されたときの処理
//   fnLanDown = function(e)
//   {
//     if ($(e.target).attr('src') === '/assets/pc.png' && $(e.target).hasClass("lanLink"))
//     {
//       $("#ns_console").append("<p>> PCにLANは1本しか引けません。</p>");
//     }
//     else
//     {
//       //canvasの追加
//       NS.addCanvas = $('<canvas width ="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns_main');
//       NS.lanFlagPoint = true;
//
//       //Classの追加
//       $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NS.lanNode);
//
//       $("#ns_main").on("mousemove", NS.fnLanDrag);
//     }
//   }
//
// //マウスのボタンが離されたときの処理
//   fnLanUp = function(e) {
//
//   }
//
//   //線を引いてる途中ns_main以外でマウスを放したとき
//   fnLanOutUp = function(e) {
//
//   }
//
//   //マウスを押したとき (線を動かす動作)
//   fnLanMoveDown = function(e) {
//     NS.elLanMoveThis = $(this);
//     NS.lanFlagmove = true;
//     NS.lanArrClass = $("#ns_main_canvas").attr("class").split(/\s?L_/);
//     NS.elLanMoveThis.on("mousemove", NS.fnLanMoveDrag);
//   }
//
//   //ドラッグしているとき (線を動かす動作)
//   fnLanMoveDrag = function(e) {
//     NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
//     NS.fnDraw();
//   }
//
//   //マウスを離したとき (線を動かす動作)
//   fnLanMoveUp = function(e) {
//
//   }


  //マウスが押された瞬間
  mouseDown = function(e){
    //console.log("testDown.hasClass: " + e.target);

    //開始地点にPCかルータが存在する場合
    if( $(e.target).hasClass("dropMachine")){

      console.log("mouseDown");
      if ($(e.target).hasClass("dropMachine")) {
        $("#ns_console").append("<p>> PCにLANは１本しか引けません。 </p>");
      }
      //マウスを押した場所の座標を取得
      NS.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
      console.log("座標の取得: " + NS.points);



      NS.elLanMoveThis = $(this);
      console.log("elLanMoveThis: " + NS.elLanMoveThis);

      console.log("mousedown.children: " + $(this).children(".lanOn").attr("class"));

      //マウスが移動するときの処理
      $('#ns_main').on("mousemove", mouseMove);
    }
  }

  //マウスが離れた瞬間
  mouseUp = function(e) {
    console.log("mouseUp");

    //離した瞬間画像の上でないとき線を削除
    if (!$(e.target).hasClass("dropMachine") || ($(e.target).hasClass("lanFirst"))){
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    }

    if (NS.points.length === 1){
      console.log("いえええええええええい");
    }

    $("#ns_main").off("mousemove", NS.mouseMove);
  }

  mouseOutUp = function(e) {

  }

  //マウスが移動した際
  mouseMove = function(e) {
    console.log("mouseMove");
    //マウスを押した場所から現在の場所までの線を再描画
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.mainCtx.beginPath();
    NS.mainCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.mainCtx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    NS.mainCtx.stroke();
  }

  //lanボタンが押された場合
  changeLanMode = function() {
    var elHtml      = $("html");
    var elMain      = $("#ns_main");
    var elMainDrag  = $("#ns_main .ui-draggable");

    //lanボタンがoffのとき
    if (NS.lanFlag === false) {
      //lanボタンをonにする
      $('#lan').attr('src', '/assets/lanCableOn.png');
      NS.lanFlag = true;

      //画像のドラッグを禁止
      elMainDrag.draggable('disable');
      elMainDrag.mouseup(function(e){ e.preventDefault(); });
      elMainDrag.mousedown(function(e){ e.preventDefault(); });
      //画像にマウスが乗ったときの動作
      elMainDrag.mouseenter(function(){
        NS.imgFlag = true;
        $(this).addClass("lanOn");
      }).mouseleave(function(){
        NS.imgFlag = false;
        $(this).removeClass("lanOn");
      })

      //イベントハンドラーをつける
      elMain.on("mousedown", mouseDown);  //マウスを押した瞬間
      elMain.on("mouseup", mouseUp);      //マウスを離した瞬間
      elHtml.on("mouseup", mouseOutUp);

      //
      //lanLinkがあるとき
      if (elMainDrag.hasClass("lanLink")) {
      //   elMain.off("mousedown", fnLanMoveDown);
      //   elMain.off("mouseup", fnLanMoveUp);
      //   elHtml.off("mouseup", fnLanMoveOutUp);
      }
      //カーソルの変更
      elMain.css("cursor", "crosshair");
      elMainDrag.css("cursor", "crosshair");
    } else {//lanボタンがonのとき
      //lanボタンをoffにする
      $('#lan').attr('src', '/assets/lanCableOff.png');
      NS.lanFlag = false;

      //画像のドラッグを可能に
      $('.dropMachine').draggable('enable');

      //イベントハンドラの削除
      elMain.off("mousedown", mouseDown);
      elMain.off("mouseup", mouseUp);
      elMain.off("mouseup", mouseOutUp)


      //カーソルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
    }

    //changeDrag();
  }

//   //LANモードのon、offに応じて画像のドラッグの可否を決める関数
//   //LANモードを切り替えてからドロップした画像に適用するために関数化したが、この関数は毎回場にある全ての画像の可否を変更しているため無駄が多いので不使用
//   changeDrag = function(){
//     if (NS.lanFlag){
//       $(".dropMachine").draggable("disable");
//       $('.dropMachine').mouseup(function(e) { e.preventDefault(); });
//       $('.dropMachine').mousedown(function(e) { e.preventDefault(); });
//
//   }else{
//     $(".dropMachine").draggable("enable");
//   }
// }

  fnChangeMode = function(){
    console.log("func:changemode");
  }

  //ルーティングテーブルを追加
  addRoutingTable = function(plus){
    console.log("addRoutingTable");
  }

  //削除
  nodeDel = function(e){
    console.log("nodeDel");
  }

  //全要素の削除
  fnAllReset = function() {
    //変数のリセット
    NS.pcNode  = 0;
    NS.swNode  = 0;
    NS.svNode  = 0;
    NS.ruNode  = 0;
    NS.lanNode = 0;
    //コンソールとトポロジーの文字を削除
    $('#ns_right dl').html("");
    $('#ns_console').html("");

    //lanLinkがあるとき

    //画像と線の削除
    $('#ns_main img').remove();
    //$('.bus').remove();
    $('#ns_main_canvas').removeClass();
    $('#ns_main_canvas').attr('data-buslan', '');
    NSF.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

  }
