//simuMainで使用する関数等のファイル


  //独自の右クリック作成
  function fncontextmenu(element) {
    console.log("fncontextmenuの引数: " + element);

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
    //ドロップした種類を判別し、情報を追加
    console.log("contextname: " + ui.draggable.attr("id"));
    if (ui.draggable.attr("id") === "PC"){
      console.log("PC");
      NS.dropNodeInt = NS.pcNode;
      NS.dropNodeName = "PC" + NS.pcNode;
      NS.dropContextName = "contextmenuPC";
      NS.dropName = "dropPC";
      NS.pcNode++;
      console.log("nodename: " + NS.dropNodeName);
    }else if (ui.draggable.attr("id") === "Router"){
      console.log("Router");
      NS.dropNodeInt = NS.ruNode;
      NS.dropNodeName = "Router" + NS.ruNode;
      NS.dropContextName = "contextmenuRouter";
      NS.dropName = "dropRouter";
      NS.ruNode++;
    }

    //ドロップした画像を追加
    $('#ns_main').append(
      $('<img>').attr({
        src: ui.draggable.attr('src'),
        alt: NS.dropNodeName,
        class: NS.dropName,
        'data_ifnum': 0,
        'data_lan_if': '',
        'data_routingtable_num': 0,
        'data_link_num': 0,
        id: NS.dropNodeName,
        style: "position: absolute; top: " + ui.offset.top + "px; left: " + ui.offset.left + "px",

      })
    );
    //画像への属性の追加の際にクラスを複数指定できなかったためここで追加(だっせぇ)
    $('#ns_main img:last-child').addClass('dropMachine');

    //ドロップした画像に右クリックの属性をつける
    $("#ns_main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');


    //mainにドロップされたものをドラッグ可能に(まだ？)
    $('#ns_main img:last-child').draggable({
      containment: 'parent',  //親要素でのみドラッグを可能にする
      zIndex: 2,
      //ドラッグ中
      drag: function(){
        //何してるかわからないし、なくても問題なかった
        // $(this).prev().offset({
        //   top:  this.offsetTop - 15,
        //   left: this.offsetLeft + 42,
        // });
        $(this).prev().css('zIndex', 3);
      },

      //ドラッグ終了
      stop: function(){
        $(this).prev().css('zIndex', 1);
      },

    });

    //ドロップした際にLANモードがonならば、ドラッグを不可にする
    if (NS.lanFlag){
      var elMainImgLast = $('#ns_main img:last-child');
      elMainImgLast.draggable('disable');
      elMainImgLast.mouseup(function(e) {e.preventDefault(e); });
      elMainImgLast.mousedown(function(e) {e.preventDefault(e); });
      //あったほうがいいんだろうがもっと他にやり方ありそう
      //応急処置感
      elMainImgLast.mouseenter(function(){
        $(this).addClass("lanOn");
      }).mouseleave(function(){
        $(this).removeClass("lanOn");
      });

    }
    //changeDrag();

    //ns_rightにトポロジを追加
    $("#ns_right dl").append("<dt><img src = /assets/plus.jpg><span>" + $("#ns_main img:last-child").attr("alt") + "</span></dt>");
    if (ui.draggable.attr("id") === "PC"){
      console.log("draggable: " + ui.draggable.attr("class"));
    }else if (ui.draggable.attr("id") === "Router"){

    }
  }

  //すべての線の描画
  fnLanDraw = function() {
    console.log("ns_main_canvasのクラス: " + $('#ns_main_canvas').attr('class'));
    if ($('#ns_main_canvas').attr('class') != '') {
      NS.mainCtx.beginPath();
      lanNum = $('#ns_main_canvas').attr('class').split(' ');
      for(i = 0; i < lanNum.length; i++){
        lanNum[i] = lanNum[i].slice(2);
        console.log("lanNum"+[i]+": " + lanNum[i]);
      }
      console.log("lanNum:" + lanNum);

    for(i = 0; i < lanNum.length; i++){
      NS.mainCtx.beginPath();
      NS.mainCtx.moveTo($(".sP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".sP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.lineTo($(".eP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".eP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.stroke();
    }

    }
  }


  //マウスが押された瞬間
  mouseDown = function(e){
    console.log("mousedownのclass: " + $(e.target).attr("class"));
    //開始地点にPCかルータが存在し、LANモードがONの場合
    if( $(e.target).hasClass("dropMachine") && NS.lanFlag){
      console.log("mouseDown");
      //PCがすでにLANが繋がれているとき
      if ($(e.target).hasClass("dropPC") && $(e.target).hasClass("lanLink")) {
        $("#ns_console").append("<p>> PCにLANは１本しか引けません。 </p>");
      }
      //canvasの追加
      NS.addCanvas = NS.addCanvasRange.prependTo('#ns_main');
      console.log("addCanvasの中身: " + NS.addCanvas);


      //classの追加()
      $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NS.lanNode);
      console.log("追加したクラス: " + $(this).children(".lanOn").attr("class"));

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
    if (!$(e.target).hasClass("dropMachine") /*|| ($(e.target).hasClass("lanFirst"))*/){
      NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    }

    if (NS.points.length === 1){
      console.log("いえええええええええい");
    }

    //画像の真ん中に線を持ってくる(わかめ)
    NS.lanArrWidth[NS.lanNode] = NS.lanWidth;//いらないっぽい
    $(".lanOn").addClass("lanLink eP_" + NS.lanNode);

    $("#ns_main_canvas").addClass("L_"+ NS.lanNode);
    spifnum = parseInt($('.sP_' + NS.lanNode).attr("data-ifnum"));
    spifnum += 1;
    epifnum = parseInt($(".eP_" + NS.lanNode).attr("data-ifnum"));
    epifnum += 1;


    fnLanDraw();

    NS.addCanvas.remove();

    $("#ns_main").off("mousemove", NS.mouseMove);
  }

  mouseOutUp = function(e) {

  }

  //マウスが移動した際
  mouseMove = function(e) {
    console.log("mouseMove");
    //マウスを押した場所から現在の場所までの線を再描画
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    //色の変更(まだ)
    if (!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      NS.addCtx.strokeStyle = "#2fb9fe";
    }else{
      NS.addCtx.strokeStyle = "#fb9003";
    }
    NS.addCtx.strokeStyle = "#2fb9fe";

    NS.addCtx.lineWidth = NS.lanWidth;
    NS.addCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.addCtx.lineTo(NS.points[NS.points.length - 1].x, NS.points[NS.points.length - 1].y);
    NS.addCtx.stroke();

    //マウスを押した場所から現在の場所までの線を再描画
    // NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    // NS.mainCtx.beginPath();
    // NS.mainCtx.moveTo(NS.points[0].x, NS.points[0].y);  //マウスを押した座標
    // NS.mainCtx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop); //現在のマウスの座標
    // NS.mainCtx.stroke();
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
        console.log("マウスが画像に乗った");
        NS.imgFlag = true;
        $(this).addClass("lanOn");
      }).mouseleave(function(){
        console.log("マウスが画像から離れた");
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
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

  }
