//simuMainで使用する関数等のファイル


  //独自の右クリック作成
  function fncontextmenu(element) {
    console.log(element);

    //document.oncontextmenu = function () {
    //   return false;
    //};

    $.contextMenu('destroy');

    $('#contextMenuTemplate').html('');

    $('#contextMenuTemplate').append('<form action = "#"/>');

    $('#contextMenuTemplate form').append('<table class = "context_IPSMIF" width = "200"> <tr align = "center"> </tr> </table>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IF">IF</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IP">IPアドレス</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="SM">SM</label></th>');


    $('#contextMenuTemplate').append(
      $('<input>').attr({
        name: "入力",
        type: "text",
        size: "16",
      })
    );

    $('#contextMenuTemplate').append(
      $('<menuitem>').attr({
        label: "削除",
      })
    );

    $('#contextMenuTemplate').append(
      $('<menuitem>').attr({
        label: "閉じる",
      })
    );

    $.contextMenu({
      selector: ".dropMachine",
      items: $.contextMenu.fromMenu($('#contextMenuTemplate'))
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
    $('#ns_main').append(
      $('<img>').attr({
        src: ui.draggable.attr('src'),
        class: 'dropMachine',
        id: "test",
        style: "position: absolute; top: " + ui.offset.top + "px; left: " + ui.offset.left + "px",

      })
    );
    //先代はこのコードで属性を与え、関数を呼ぼ出している
    $("#ns_main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');

    //mainにドロップされたものをドラッグ可能に(オプションによってmain内でのみに移動を限定する必要あり)
    $('#ns_main img:last-child').draggable({});
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

  //マウスが移動した際
  testMove = function(e) {
    console.log("testMove");
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.mainCtx.beginPath();
    NS.mainCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.mainCtx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    NS.mainCtx.stroke();
  }




  //マウスが押された瞬間
  testDown = function(e) {
    console.log("testDown");

    //マウスを押した場所の座標を取得
    NS.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
    console.log(NS.points);

    NS.elLanMoveThis = $(this);
    console.log("elLanMoveThis: " + NS.elLanMoveThis);
    $("#ns_main").on("mousemove", NS.testMove);

  }

  //マウスが離れた瞬間
  testUp = function(e) {
    console.log("testUp");

    var nowX = e.pageX - this.offsetLeft;
    var nowY = e.pageY - this.offsetTop;

    NS.mainCtx.beginPath();
    NS.mainCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.mainCtx.lineTo(nowX, nowY);
    NS.mainCtx.stroke();


    $("#ns_main").off("mousemove", NS.testMove);
  }

  testOutUp = function(e) {

  }

  //マウスが移動した際
  testMove = function(e) {
    console.log("testMove");
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.mainCtx.beginPath();
    NS.mainCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.mainCtx.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    Ns.mainCtx.stroke();
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

      //イベントハンドラーをつける
      //elMain.on("mousedown", fnLanDown);  //マウスボタンが押されたとき
      //elMain.on("mouseup", fnLanUp);      //マウスボタンが離れたとき
      //elHtml.on("mouseup", fnLanOutUp);

      //test
      elMain.on("mousedown", testDown);
      elMain.on("mouseup", testUp);
      elHtml.on("mouseup", testOutUp);

      //
      // //lanLinkがあるとき
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
      //カースルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
    }
  }
