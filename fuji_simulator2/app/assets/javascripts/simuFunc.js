//simuMainで使用する関数等のファイル


  //独自の右クリック作成
  fncontextmenu = function(element) {
    console.log("fncontextmenuの引数: " + element);


    var nodeName = $("img[alt='" + $(element)[0].alt + "']")[0].alt;
    console.log("nodeName: " + nodeName);
    console.log("nodeName.slice(6): " + nodeName.slice(6));
    console.log('element: ' + $(element).attr('dropNumber'));

    $.contextMenu( 'destroy' );

    // if ($(element).hasClass('dropPC'))
    // {
    //   fnCreateIP_SM(nodeName.slice(2), 0, 'PC');
    // }else if ($(element).hasClass('dropRouter')){
    //   for(i = 0;i < $(element).attr('data-ifnum'); i++){
    //     num = $('#ns_right dt: contains(' + nodeName + ') + dd p:contains p:contains(IP-' + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
    //     fnCreateIP_SM(nodeName.slice(6), num, 'Router');
    //   }
    // }

    //ルータの場合のみルーティングテーブルを増やすボタンを表示
    if ($(element).hasClass('dropRouter')){
      $('#addRButtom').css('display', 'block');
    }else if ($(element).hasClass('dropPC')){
      $('#addRButtom').css('display', 'none');
    }


    fnCreateIP_SM(0,0,0);
    fnCreateRoutingTable(0, 0);

    $.contextMenu({
      //selector: '.' + NS.dropContextName,
      //items: $.contextMenu.fromMenu($(menuName)),
      selector: ".dropMachine",
      items: $.contextMenu.fromMenu($("#contextPlace")),
    });
  }

  //ns_rightに値を入れる
  fnCopy = function(e) {
    console.log("fnCopy");
    var id = 'rightInfo_' + e.id;
    $('#' + id).text(e.value);

  }

  //IPアドレスとSM入力欄を作成
  //nodenum:
  fnCreateIP_SM = function(nodenum, ifNum, kind) {
    $('#contextPlace form .context-IPSMIF #inputIPSM').html('');
    for(i = 0; i < 3; i++){
      $('#contextPlace form .context-IPSMIF tr:last-child').after('<tr id = "inputIPSM" align = "center"></tr>');
      $('#contextPlace form .context-IPSMIF tr:last-child').append('<td>if' + i + ' :</td>');
      //IPアドレス入力欄
      $('#contextPlace form .context-IPSMIF tr:last-child').append($('<td/>').append(
        $('<input/>').attr({
          name: 'IPアドレス',
          type: 'text',
          size: '16',
          value: '',
          id: 'IP' + i + '_' + i,
          class: 'inputIP inputIPSMIF-item',
          onKeyUp: 'return fnCopy(this);',
        })
      ));

      //SM入力欄
      $('#contextPlace form .context-IPSMIF tr:last-child').append($('<td/>').append(
        $('<input/>').attr({
          name: 'SM',
          type: 'text',
          size: '2',
          value: '11',
          id: 'SM' + i + '_' + i,
          class: 'inputSM inputIPSMIF-item',
          onKeyUp: 'return fnCopy(this);',
        })
      ));
    }

  }

  //RoutingTable入力欄を作成
  fnCreateRoutingTable = function(nodeNum, iNum) {
    $('#contextPlace form .context-RoutingTable #inputRoutingTable').html('');
    for(i = 0;i < 4;i++){
      $('#contextPlace .context-RoutingTable tr:last-child').after('<tr id = inputRoutingTable align = "center"></tr>');

      $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td><input id="routingtable-IP' + nodeNum + '_' + iNum + '"  type="text" size="13" onKeyUp="return fnCopy(this);"/>/' +
      '<input id="routingtable-SM' + nodeNum + '_' + iNum +'" type="text" size="1" onKeyUp="return fnCopy(this);"/>→</td>');
      $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td><input id="routingtable-NHA' + nodeNum + '_' + iNum + '" type="text" size="13" onKeyUp="return fnCopy(this);"/></td>');
      $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td>if<input id="routingtable-IF' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"></td>');

      //最初以外(+ボタンで追加)なら削除ボタンを表示
      if (true) {
        $('#contextPlace .context-RoutingTable tr:last-child')
        .append('<img src = "/assets/minus.jpg" id = "minus' + nodeNum + '_' + iNum + '" class = "Router' + nodeNum + '" onClick = "return fnDelRT(this)">');
      }

    }
  }

  //ルーティングテーブルを追加
  addRT = function(plus){
    console.log("addRT");
    // console.log("plus.class: " + $(plus).attr('class'));
    // img = $('.ui-droppable img');
    // console.log("img.alt: " + img[0].id);
    // $('ul form .context-RoutingTable tr:last-child').after('<tr align = "center"></tr>');
    //
    // for(i = 0; i < img.length; i++){
    //   if (img[i].alt === $(plus).attr('class')) {
    //     element = img[i];
    //   }
    // }
    //
    // if ($(element).attr('data-routingtableNm') === undefined) {
    //   $(elemment).attr('data-routingtablenum', 1);
    //   num = 1;
    // }else{
    //   num = parseInt($(element).attr('data-routingtableNum'));
    //   num += 1;
    //   $(element).attr('data-routingtablenum', num);
    // }
    //仮置き
    var nodeNum = 0;
    var iNum = 0;

    $('ul .context-RoutingTable tr:last-child').after('<tr id = inputRoutingTable align = "center"></tr>');

    $('ul .context-RoutingTable tr:last-child')
    .append('<td><input id="routingtable-IP' + nodeNum + '_' + iNum + '"  type="text" size="13" onKeyUp="return fnCopy(this);"/>/' +
    '<input id="routingtable-SM' + nodeNum + '_' + iNum +'" type="text" size="1" onKeyUp="return fnCopy(this);"/>→</td>');
    $('ul .context-RoutingTable tr:last-child')
    .append('<td><input id="routingtable-NHA' + nodeNum + '_' + iNum + '" type="text" size="13" onKeyUp="return fnCopy(this);"/></td>');
    $('ul .context-RoutingTable tr:last-child')
    .append('<td>if<input id="routingtable-IF' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"></td>');
    $('ul .context-RoutingTable tr:last-child')
    .append('<img src = "/assets/minus.jpg" id = "minus' + nodeNum + '_' + iNum + '" class = "Router' + nodeNum + '" onClick = "return fnDelRT(this)">');
  }


  //追加したルーティングテーブルを削除する
  fnDelRT = function(e) {

  }



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
        'dropNumber': NS.dropNodeInt,
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
    $("#ns_right dl").append("<dt><img class = 'rightDetail'src = /assets/plus.jpg><span>" + ui.draggable.attr("alt") + NS.dropNodeInt + "</span></dt>" +
    "<dd><p class = 'rightInfo-IPSM'>IP-0: <span id = 'rightInfo_IP" + NS.dropNodeInt + "'></span> /<span id = 'rightInfo_SM" + NS.dropNodeInt + "'></span></p></dd>");
    if (ui.draggable.attr("id") === "PC"){
      //console.log("draggable: " + ui.draggable.attr("class"));
      console.log("PCCCCCCCCCCc!");
      $('#ns_right dt:contains("' + ui.draggable.attr("alt") + NS.droNodeInt + '") + dd')
      .append('<p class = "rightInfo_routingtableIPSM"><span id = "rightInfo_PCroutingtable-IP' + NS.dropNodeInt + '_' + '0' + '">DefaultGateway</span>/<span id = "rightInfo_PCroutingtableSM' + NS.dropNodeInt + '_' + '0' + '"</span>' +
      '<br/>→<span id = "rightInfo_PCroutingtableNHA' + NS.dropNodeInt + '_' + '0' + '"></span>:IF<span id = "rightInfo_PCroutingtableIF' + NS.dropNodeInt + '_' + '0' + '"></span></p>');
    }else if (ui.draggable.attr("id") === "Router"){

    }
    // dd要素(IPとSM)を隠す
    $('#ns_right dd:last').css('display', 'none');
    //fnNameDraw(ui.draggable.attr('alt') + NS.dropNodeInt);
  }

  //メインの線の描画
  //関連付けされたsPとePの画像の中心から中心への描画
  fnMainLanDraw = function() {
    console.log("fnMainLanDrawだよー");
    console.log("ns_main_canvasのクラス: " + $('#ns_main_canvas').attr('class'));
    if ($('#ns_main_canvas').attr('class') != '') {
      //NS.mainCtx.beginPath();
      lanNum = $('#ns_main_canvas').attr('class').split(' ');
      for(i = 0; i < lanNum.length; i++){
        lanNum[i] = lanNum[i].slice(2);
        console.log("lanNum"+[i]+": " + lanNum[i]);
      }
      console.log("lanNum:" + lanNum);
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

    for(i = 0; i < lanNum.length; i++){
      NS.mainCtx.beginPath();
      NS.mainCtx.moveTo($(".sP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".sP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.lineTo($(".eP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".eP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.stroke();
    }

    }
  }


  //マウスが押された瞬間
  fnLanOnDown = function(e){
    console.log("mousedownのclass: " + $(e.target).attr("class"));
    //開始地点にPCかルータが存在し、かつLANモードがONの場合
    if( $(e.target).hasClass("dropMachine") && NS.lanFlag){
      console.log("fnLanOnDown");
      //PCがすでにLANが繋がれているとき
      if ($(e.target).hasClass("dropPC") && $(e.target).hasClass("lanLink")) {
        $("#ns_console").append("<p>> PCにLANは１本しか引けません。 </p>");
      }
      //canvasの追加
      NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns_main');
      //NS.addCanvas = NS.addCanvasRange.prependTo('#ns_main');
      console.log("addCanvasの中身: " + NS.addCanvas);

      //lanLinkがある場合
      if ($(this).children(".lanOn").hasClass("lanLink")) {
        NS.lanLinkFlag = true;
      }

      //classの追加()
      $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NS.lanNode);
      console.log("追加したクラス: " + $(this).children(".lanOn").attr("class"));

      //マウスを押した場所の座標を取得
      NS.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
      console.log("座標の取得: " + NS.points);

      if ($('#ns_main .uidraggable').hasClass("lanLink")){
        NS.elLanMoveThis = $(this);
        NS.lanArrClass = $('#ns_main_canvas').attr("class").split(/\s?L_/);
      }

      NS.elLanMoveThis = $(this);
      console.log("elLanMoveThis: " + NS.elLanMoveThis);

      console.log("mousedown.children: " + $(this).children(".lanOn").attr("class"));

      //マウスが移動するときの処理
      $('#ns_main').on("mousemove", fnMouseMove);
    }
  }

  //マウスが離れた瞬間
  fnLanOnUp = function(e) {
    console.log("fnLanOnUp");

    //離した瞬間画像の上でないとき線を削除
    if (!$(e.target).hasClass("dropMachine") || ($(e.target).hasClass("lanFirst"))){
      //画像以外をクリックした際エラー(別に関数を用意)
      NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    }

    if (NS.points.length === 1){
      console.log("いえええええええええい");
    }

    //画像の真ん中に線を持ってくる
    if( !($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn"))
    {
    NS.lanArrWidth[NS.lanNode] = NS.lanWidth;//いらないっぽい
    $(".lanOn").addClass("lanLink eP_" + NS.lanNode);

    $("#ns_main_canvas").addClass("L_"+ NS.lanNode);
    spifnum = parseInt($('.sP_' + NS.lanNode).attr("data-ifnum"));
    spifnum += 1;
    epifnum = parseInt($(".eP_" + NS.lanNode).attr("data-ifnum"));
    epifnum += 1;

    //描画
    //NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    fnMainLanDraw();

    //変数とフラグを更新
    NS.lanNode++;
    NS.points = [];
    NS.addCanvas.remove();
  }
    //イベントハンドラの削除
    $("#ns_main").off("mousemove", NS.fnMouseMove);
    $("#ns_main .ui-draggable").removeClass("lanFirst");
  }

  fnLanOnOutUp = function(e) {

  }

  //マウスが移動した際
  fnMouseMove = function(e) {
    console.log("fnMouseMove");
    //マウスを押した場所から現在の場所までの線を再描画
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    //NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    //色の変更
    if (!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      //線が自分以外の画像に触れているとき
      NS.addCtx.strokeStyle = "#2fb9fe";
    }else{
      NS.addCtx.strokeStyle = "#fb9003";
    }

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

    //fnMainLanDraw();
  }

  //LANモードがoffかつ、線が描画されているときにマウスを押した際の関数
  fnLanOffDown = function(e) {
    NS.elLanMoveThis = $(this);
    console.log("elLanMoveThis: " + NS.elLanMoveThis);
    NS.lanFlagMove = true;
    NS.lanArrClass = $("#ns_main_canvas").attr("class").split(/\s?L_/);
    NS.elLanMoveThis.on("mousemove", fnLanOffDrag);
  }

  //LANモードがoffかつ、線が描画されているときにマウスを離した際の関数
  fnLanOffUp = function(e) {
    console.log("fnLanOffUp");
    NS.elLanMoveThis.off("mousemove", fnLanOffDrag);
  }

  fnLanOffOutUp = function(e) {

  }

  //画像のドラッグに応じて関連された線を移動し、描画する関数
  fnLanOffDrag = function(e) {
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    fnMainLanDraw();
  }

  //lanボタンが押された場合
  fnChangeLanMode = function() {
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
      elMain.on("mousedown", fnLanOnDown);  //マウスを押した瞬間
      elMain.on("mouseup", fnLanOnUp);      //マウスを離した瞬間
      elHtml.on("mouseup", fnLanOnOutUp);
      //lanLinkがあるとき
      if (elMainDrag.hasClass("lanLink")) {
        elMain.off("muusedown", fnLanOffDown);
        elMain.off("mouseup", fnLanOffUp);
        elHtml.off("mouseup", fnLanOffOutUp);
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
      elMain.off("mousedown", fnLanOnDown);
      elMain.off("mouseup", fnLanOnUp);
      elMain.off("mouseup", fnLanOnOutUp);
      elMainDrag.off("mouseenter").off("mouseleave");
      //カーソルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
      //LanLinkがあるとき
      if (elMainDrag.hasClass("lanLink")) {
        elMain.on("mousedown", fnLanOffDown);
        elMain.on("mouseup", fnLanOffUp);
        elHtml.on("mouseup", fnLanOffOutUp);
      }
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
