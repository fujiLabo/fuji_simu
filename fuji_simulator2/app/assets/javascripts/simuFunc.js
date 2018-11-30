//simuMainで使用する関数等のファイル


//独自の右クリック作成
fncontextmenu = function(element) {
  const nodeNum = $(element).attr('dropNumber');
  const ifNum = $(element).attr('data_ifnum');
  var kind;

  console.log("node: " + $("img[alt='" + $(element)[0].alt + "']")[0].alt);
  console.log("node(new): " + $(element).attr('dropNumber'));
  console.log("fncontextmenuの引数: " + element);


  var nodeName = $("img[alt='" + $(element)[0].alt + "']")[0].alt;
  console.log("nodeName: " + nodeName);
  console.log("nodeName.slice(6): " + nodeName.slice(6));
  console.log('element: ' + $(element).attr('dropNumber'));

  $.contextMenu('destroy');

  //問題演習と自由病がで処理を変えるなら
  //if ($('.change_mode').hasClass('question')){
  //
  //}



  //PCとルータで場合分け
  if ($(element).hasClass('contextmenuRouter')) {
    kind = 'Router';
    //ルータの場合のみルーティングテーブルを増やすボタンを表示
    $('#addRButtom').css('display', 'block');
  } else if ($(element).hasClass('contextmenuPC')) {
    //fnCreateIP_SM($(element).attr('dropNumber'), 0, 'PC');
    kind = 'PC';

    $('#addRButtom').css('display', 'none');
  }

  fnCreateIP_SM(nodeNum, ifNum, kind);
  fnCreateRT(0, 0);

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
  console.log("id: " + id);
  $('#' + id).text(e.value);

}

//IPアドレスとSM入力欄を作成
//nodenum:
fnCreateIP_SM = function(nodeNum, ifNum, kind) {
  $('#contextPlace form .context-IPSMIF #inputIPSM').html('');
  //PCでは表示する入力欄を一つに、idやvalueの値も変えるためルータとは別に定義する
  if (kind === 'PC') {
    $('#contextPlace form .context-IPSMIF tr:last-child').after('<tr id = "inputIPSM" align = "center"></tr>');
    $('#contextPlace form .context-IPSMIF tr:last-child').append('<td>if0 :</td>');
    //IPアドレス入力欄
    $('#contextPlace form .context-IPSMIF tr:last-child').append($('<td/>').append(
      $('<input/>').attr({
        name: 'IPアドレス',
        type: 'text',
        size: '16',
        value: document.getElementById('rightInfo_IP' + nodeNum).innerHTML,
        id: 'IP' + nodeNum,
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
        value: document.getElementById('rightInfo_SM' + nodeNum).innerHTML,
        id: 'SM' + nodeNum,
        class: 'inputSM inputIPSMIF-item',
        onKeyUp: 'return fnCopy(this);',
      })
    ));
  } else if (kind === 'Router') {
    for (i = 0; i < ifNum; i++) {
      $('#contextPlace form .context-IPSMIF tr:last-child').after('<tr id = "inputIPSM" align = "center"></tr>');
      $('#contextPlace form .context-IPSMIF tr:last-child').append('<td>if' + i + ' :</td>');
      //IPアドレス入力欄
      $('#contextPlace form .context-IPSMIF tr:last-child').append($('<td/>').append(
        $('<input/>').attr({
          name: 'IPアドレス',
          type: 'text',
          size: '16',
          value: document.getElementById('rightInfo_IP' + nodeNum + '_' + i), //.innerHTML,
          //id: 'IP' + i + '_' + i,
          id: 'IP' + nodeNum + '_' + i,
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
          value: document.getElementById('rightInfo_SM' + nodeNum + '_' + i), //.innerHTML,
          //id: 'SM' + i + '_' + i,
          id: 'SM' + nodeNum + '_' + i,
          class: 'inputSM inputIPSMIF-item',
          onKeyUp: 'return fnCopy(this);',
        })
      ));
    }
  }

  $('#contextPlace form .context-IPSMIF tr:last-child').attr('syze')

}

//RoutingTable入力欄を作成
//fnCreateRoutingTable = function(nodeNum, iNum) {
fnCreateRT = function(nodeNum, iNum) {
  nodeNum = 0;
  iNum = 0;
  $('#contextPlace form .context-RoutingTable #inputRoutingTable').html('');
  for (i = 0; i < 4; i++) {
    $('#contextPlace .context-RoutingTable tr:last-child').after('<tr id = inputRoutingTable align = "center"></tr>');

    $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td><input id="IP' + nodeNum + '_' + iNum + '"  type="text" size="13" onKeyUp="return fnCopy(this);"/>/' +
        '<input id="RT_SM' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"/>→</td>');
    $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td><input id="RT_NHA' + nodeNum + '_' + iNum + '" type="text" size="13" onKeyUp="return fnCopy(this);"/></td>');
    $('#contextPlace .context-RoutingTable tr:last-child')
      .append('<td>if<input id="RT_IF' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"></td>');

    //最初以外(+ボタンで追加)なら削除ボタンを表示
    if (i !== 0) {
      $('#contextPlace .context-RoutingTable tr:last-child')
        .append('<img src = "/assets/minus.jpg" id = "minus' + nodeNum + '_' + iNum + '" class = "Router' + nodeNum + '" onClick = "return fnDelRT(this)">');
    }

  }
}

//ルーティングテーブルを追加
addRT = function(plus) {
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
    .append('<td><input id="RT_IP' + nodeNum + '_' + iNum + '"  type="text" size="13" onKeyUp="return fnCopy(this);"/>/' +
      '<input id="RT_SM' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"/>→</td>');
  $('ul .context-RoutingTable tr:last-child')
    .append('<td><input id="RT_NHA' + nodeNum + '_' + iNum + '" type="text" size="13" onKeyUp="return fnCopy(this);"/></td>');
  $('ul .context-RoutingTable tr:last-child')
    .append('<td>if<input id="RT_IF' + nodeNum + '_' + iNum + '" type="text" size="1" onKeyUp="return fnCopy(this);"></td>');
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

//左部分からドロップされた画像を判別する関数
fnMainDrop = function(ui, obj) {
  //種類の判別
  if (ui.draggable.attr('id') === 'Bus'){
    fnBusDrop();
  }else{
    fnMachineDrop(ui, obj);
  }

}

//ドロップされた画像がPCまたはルータだった場合
fnMachineDrop = function(ui, obj){
  if (ui.draggable.attr("id") === "PC") {
    NS.dropNodeInt = NS.pcNode;
    NS.dropNodeName = "PC" + NS.pcNode;
    NS.dropContextName = "contextmenuPC";
    //NS.dropName = "dropPC";
    NS.pcNode++;
  } else if (ui.draggable.attr("id") === "Router") {
    NS.dropNodeInt = NS.ruNode;
    NS.dropNodeName = "Router" + NS.ruNode;
    NS.dropContextName = "contextmenuRouter";
    //NS.dropName = "dropRouter";
    NS.ruNode++;
  } else if (ui.draggable.attr('id') === 'Bus') {
    fnBusDrop();
  }

  //ドロップした画像を追加
  $('#ns_main').append(
    $('<img>').attr({
      src: ui.draggable.attr('src'),
      alt: NS.dropNodeName,
      class: NS.dropContextName,
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
    containment: 'parent', //親要素でのみドラッグを可能にする
    zIndex: 2,
    //ドラッグ中
    drag: function() {
      //追従
      if ($(this).prev().hasClass('get_node2') || $(this).prev().hasClass('send_node2')) {
        $(this).prev().offset({
          top: this.offsetTop - 15,
          left: this.offsetLeft + 42,
        });
        $(this).prev().css('zIndex', 3);
      }
    },
    //ドラッグ終了
    stop: function() {
      if ($(this).prev().hasClass('get-node2') || $(this).prev().hasClass('send_node2')) {
        $(this).prev().css('zIndex', 1);
      }
    },

  });

  //ドロップした際にLANモードがonならば、ドラッグを不可にする
  if (NS.lanFlag) {
    var elMainImgLast = $('#ns_main img:last-child');
    elMainImgLast.mouseup(function(e) {
      e.preventDefault(e);
    });
    elMainImgLast.mousedown(function(e) {
      e.preventDefault(e);
    });
    //応急処置感
    elMainImgLast.mouseenter(function() {
      NS.imgFlag = true;
      $(this).addClass("lanOn");
      $(this).draggable('disable');
    }).mouseleave(function() {
      NS.imgFlag = false;
      $(this).removeClass("lanOn");
      $(this).draggable('enable');
    });
  }
  //changeDrag();

  //ns_rightにトポロジを追加
  //'rightInfo_IP" + NS.dropNodeInt + "' →rightInfo_test
  $("#ns_right dl").append("<dt><img class = 'rightDetail'src = /assets/plus.jpg><span>" + ui.draggable.attr("alt") + NS.dropNodeInt + "</span></dt>" +
    "<dd><p class = 'rightInfo_IPSM'>IP-0: <span id = 'rightInfo_IP" + NS.dropNodeInt + "'></span> /<span id = 'rightInfo_SM" + NS.dropNodeInt + "'></span></p></dd>");
  if (ui.draggable.attr("id") === "PC") {
    //console.log("draggable: " + ui.draggable.attr("class"));
    $('#ns_right dt:contains("' + ui.draggable.attr("alt") + NS.dropNodeInt + '") + dd')
      .append('<p class="rightInfo_RT_IPSM"><span id="rightInfo_PC_RT_IP' + NS.dropNodeInt + '_' + '0' + '">DefaultGateway</span>/<span id="rightInfo_PC_RT_SM' + NS.dropNodeInt + '_' + '0' + '"></span>' +
        '<br/>→<span id="rightInfo_PC_RT_NHA' + NS.dropNodeInt + '_' + '0' + '"></span>：IF<span id="rightInfo_PC_RT_IF' + NS.dropNodeInt + '_' + '0' + '"></span></p>');
  } else if (ui.draggable.attr("id") === "Router") {
    $('#ns_right dt:contains("' + ui.draggable.attr("alt") + NS.dropNodeInt + '") + dd')
      .append('<p class="rightInfo_RT_IPSM"><span id="rightInfo_Router_RT_IP' + NS.dropNodeInt + '_' + '0' + '">DefaultGateway</span>/<span id="rightInfo_Router_RT_SM' + NS.dropNodeInt + '_' + '0' + '"></span>' +
        '<br/>→<span id="rightInfo_Router_RT_NHA' + NS.dropNodeInt + '_' + '0' + '"></span>：IF<span id="rightInfo_Router_RT_IF' + NS.dropNodeInt + '_' + '0' + '"></span></p>');
  }
  // dd要素(IPとSM)を隠す
  $('#ns_right dd:last').css('display', 'none');
  //fnNameDraw(ui.draggable.attr('alt') + NS.dropNodeInt);
}

//ドロップされた画像がBusだった場合
fnBusDrop = function() {
  console.log('fnBusDrop');
  NS.addCtx = NS.addCanvas.get(0).getContext('2d');
  NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

}

//メインの線の描画
//関連付けされたsPとePの画像の中心から中心への描画
fnMainLanDraw = function() {
  console.log("fnMainLanDrawだよー");
  console.log("ns_main_canvasのクラス: " + $('#ns_main_canvas').attr('class'));
  if ($('#ns_main_canvas').attr('class') != '') {
    NS.mainCtx.beginPath();
    lanNum = $('#ns_main_canvas').attr('class').split(' ');
    for (i = 0; i < lanNum.length; i++) {
      lanNum[i] = lanNum[i].slice(2);
      console.log("lanNum" + [i] + ": " + lanNum[i]);
    }
    console.log("lanNum:" + lanNum);
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

    for (i = 0; i < lanNum.length; i++) {
      NS.mainCtx.beginPath();
      NS.mainCtx.moveTo($(".sP_" + lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".sP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.lineTo($(".eP_" + lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".eP_" + lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
      NS.mainCtx.stroke();
    }

  }
}


//マウスが押された瞬間
fnLanOnDown = function(e) {
  console.log("mousedownのclass: " + $(e.target).attr("class"));
  //開始地点にPCかルータが存在し、かつLANモードがONの場合
  if ( NS.imgFlag && NS.lanFlag) {
    console.log("fnLanOnDown");
    //PCがすでにLANが繋がれているとき
    if ($(e.target).hasClass("contextmenuPC") && $(e.target).hasClass("lanLink")) {
      $("#ns_console").append("<p>> PCにLANは１本しか引けません。 </p>");
    } else {
      //canvasの追加
      NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns_main');
      NS.lanPointFlag = true;
      console.log("addCanvasの中身: " + NS.addCanvas);

      //lanLinkがある場合
      if ($(this).children(".lanOn").hasClass("lanLink")) {
        NS.lanLinkFlag = true;
      }

      //classの追加()
      $(this).children(".lanOn").addClass("lanFirst lanLink sP_" + NS.lanNode);
      console.log("追加したクラス: " + $(this).children(".lanOn").attr("class"));

      //マウスを押した場所の座標を取得
      NS.points = [{
        x: e.pageX - this.offsetLeft,
        y: e.pageY - this.offsetTop
      }];

      //busから線を引いたときのフラグ
      if ($('.sP_' + NS.lanNode).hasClass('bus')) {
        NS.busFlag = true;
      }

      // if ($('#ns_main .uidraggable').hasClass("lanLink")) {
      //   NS.elLanMoveThis = $(this);
      //   NS.lanArrClass = $('#ns_main_canvas').attr("class").split(/\s?L_/);
      // }
      //
      // NS.elLanMoveThis = $(this);
      // console.log("elLanMoveThis: " + NS.elLanMoveThis);

      //console.log("mousedown.children: " + $(this).children(".lanOn").attr("class"));

      //マウスが移動するときの処理
      $('#ns_main').on("mousemove", fnLanOnDrag);
    }
  }
}

//マウスが離れた瞬間
fnLanOnUp = function(e) {
  console.log("fnLanOnUp");

  if (NS.lanPointFlag && NS.lanFlag) {
    NS.lanDeleteFlag = true;
    //マウスを押してドラッグしなかったとき || 画像の上でないとき線を削除 || 最初の画像のとき
    if (NS.points.length === 1 || !$(e.target).hasClass("dropMachine") || ($(e.target).hasClass("lanFirst"))) {
      if (NS.lanLinkFlag === true) {
        $('.sP_' + NS.lanNode).removeClass('sP_' + NS.lanNode);
      } else {
        $('.sP_' + NS.lanNode).removeClass('lanLink sP_' + NS.lanNode);
      }
      $('#ns_main_canvas').removeClass('L_' + NS.lanNode);
      NS.lanFlagDelet = false;
      NS.lanNode--;

      //画像以外をクリックした際エラー(別に関数を用意)
      NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    }
    //else if bus関連の処理

    //PCにもう線が引かれているとき
    else if ($(e.target).hasClass('lanLink') && $(e.target).hasClass('contextmenuPC')) {
      if (NS.lanLinkFlag === true) {
        $('.sP_' + NS.lanNode).removeClass('sP_' + NS.lanNode);
      } else {
        $('.sP_' + NS.lanNode).removeClass('lanLink sP_' + NS.lanNode);
      }
      $('#ns_main_canvas').removeClass('L_' + NS.lanNode);
      $('#ns_console').append('<p>> PCにLANは1本しか引けません。</p>');
      NS.lanFlagDelet = false;
      NS.lanNode--;
    }
    //同じ場所に線を引かないようにする
    else {
      for (var i = 0; i < NS.lanNode; i++) {
        if (($('.lanFirst').hasClass('sP_' + i) && $('.lanOn').hasClass('eP_' + i)) ||
          ($('.lanFirst').hasClass('eP_' + i) && $('.lanOn').hasClass('sP_' + i))) {
          $('.sP_' + NS.lanNode).removeClass('sP_' + NS.lanNode);
          $('#ns_main_canvas').removeClass('L_' + NS.lanNode);
          $('#ns_console').append('<p>> 同じところにLANは引けません。</p>');
          NS.lanFlagDelet = false;
          NS.lanNode--;
          //fnMainLanDraw();
          break;
        }
      }
    }

    //画像の真ん中に線を持ってくる
    if (!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      NS.lanArrWidth[NS.lanNode] = NS.lanWidth; //いらないっぽい
      $(".lanOn").addClass("lanLink eP_" + NS.lanNode);

      $("#ns_main_canvas").addClass("L_" + NS.lanNode);
      spifnum = parseInt($('.sP_' + NS.lanNode).attr("data-ifnum"));
      spifnum += 1;
      epifnum = parseInt($(".eP_" + NS.lanNode).attr("data-ifnum"));
      epifnum += 1;

      //ココらへん完コピ
      //lanとifの結びつけ
      if ($('.sP_' + NS.lanNode).hasClass('bus') == false) {
        if ($('.sP_' + NS.lanNode).attr('data_lan_if') == '') {
          tmp = $('.sP_' + NS.lanNode).attr('data_lan_if');
          tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
          $('.sP_' + NS.lanNode).attr('data_lan_if', tmp);
        } else if ($('.sP_' + NS.lanNode).attr('data_lan_if') != '') {
          tmp = $('.sP_' + NS.lanNode).attr('data_lan_if');
          tmp += ' ';
          tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
          $('.sP_' + NS.lanNode).attr('data_lan_if', tmp);
        }
        tmp = $('.sP_' + NS.lanNode).attr('data-linknum');
        tmp = parseInt(tmp) + 1;
        $('.sP_' + NS.lanNode).attr('data-linknum', tmp);

      }
      if ($('.eP_' + NS.lanNode).hasClass('bus') == false) {
        if ($('.eP_' + NS.lanNode).attr('data_lan_if') == "") {
          tmp = $('.eP_' + NS.lanNode).attr('data_lan_if');
          tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
          $('.eP_' + NS.lanNode).attr('data_lan_if', tmp);
        } else if ($('.eP_' + NS.lanNode).attr('data_lan_if') != "") {
          tmp = $('.eP_' + NS.lanNode).attr('data_lan_if');
          tmp += ' ';
          tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
          $('.eP_' + NS.lanNode).attr('data_lan_if', tmp);
        }
        tmp = $('.eP_' + NS.lanNode).attr('data-linknum');
        tmp = parseInt(tmp) + 1;
        $('.eP_' + NS.lanNode).attr('data-linknum', tmp);
      }


      //rightinfoに追加
      //router->router
      if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

        $('#nsf-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
            $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
        $('.sP_' + NS.lanNode).attr('data-ifnum', spifnum);

        $('#nsf-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
            $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
        $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

      }

      //pc,bus->router
      if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

        $('#nsf-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
            $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
        $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

      }

      //router->pc,bus
      if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router') {
        $('#nsf-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
            $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
        $('.sP_' + NS.lanNode).attr('data-ifnum', spifnum);
      }


      //描画
      //NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      fnMainLanDraw();
    }
    //変数とフラグを更新
    NS.lanNode++;
    NS.points = [];
    NS.lanLinkFlag = false;
    NS.lanPointFlag = false;

    NS.addCanvas.remove();
    //イベントハンドラの削除
    $("#ns_main").off("mousemove", NS.fnLanOnDrag);
    $("#ns_main .ui-draggable").removeClass("lanFirst");
  }
}

//線を引いてる途中 ns_main以外でマウスを離したとき
fnLanOnOutUp = function(e) {
  console.log("fnLanOnOutUp");
  if (NS.lanPointFlag) {
    NS.addCanvas.remove();
    if (!(NS.lanLinkFlag)) {
      $(".sP_" + NS.lanNode).removeClass('lanLink');
    }
    $('#ns_main').off('mousemove', fnLanOnDrag);
    $('#ns_main .ui-draggable').removeClass('lanFirst');
    $('.sP_' + NS.lanNode).removeClass('sP_' + NS.lanNode);
    $('#ns_main_canvas').removeClass('L_' + NS.lanNode);
    //変数とフラグをリセット
    NS.points = [];
    NS.lanLinkFlag = false;
    NS.lanPointFlag = false;
  }
}

//マウスが移動した際
fnLanOnDrag = function(e) {
  console.log("fnLanOnDrag");
  //マウスを押した場所から現在の場所までの線を再描画
  NS.addCtx = NS.addCanvas.get(0).getContext('2d');
  NS.points.push({
    x: e.pageX - this.offsetLeft,
    y: e.pageY - this.offsetTop,
  });
  NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
  NS.addCtx.beginPath();
  //色の変更
  if (!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
    //線が自分以外の画像に触れているとき
    NS.addCtx.strokeStyle = "#2fb9fe";
  } else {
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
  if (NS.lanMoveFlag === true) {
    NS.lanMoveFlag = false;
    NS.elLanMoveThis.off("mousemove", fnLanOffDrag);
  }
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
  var elHtml = $("html");
  var elMain = $("#ns_main");
  var elMainDrag = $("#ns_main .ui-draggable");

  //lanボタンがoffのとき
  if (NS.lanFlag === false) {
    //lanボタンをonにする
    $('#lan').attr('src', '/assets/lanCableOn.png');
    NS.lanFlag = true;

    //イベントハンドラーをつける
    elMain.on("mousedown", fnLanOnDown); //マウスを押した瞬間
    elMain.on("mouseup", fnLanOnUp); //マウスを離した瞬間
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

    //画像のドラッグ防止
    elMainDrag.mouseup(function(e) { e.preventDefault(); });
    elMainDrag.mousedown(function(e) {e.preventDefault(); });

    //画像にマウスが乗ったときの動作
    elMainDrag.mouseenter(function() {
      console.log("マウスが画像に乗った");
      NS.imgFlag = true;
      $(this).addClass("lanOn");
      $(this).draggable('disable');
    }).mouseleave(function() {
      console.log("マウスが画像から離れた");
      NS.imgFlag = false;
      $(this).removeClass("lanOn");
      $(this).draggable('enable');
    });

  } else { //lanボタンがonのとき
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

fnChangeMode = function() {
  console.log("func:changemode");
}



//削除(エラー)(途中)
nodeDel = function(e) {
  console.log("nodeDel");
  nodeName = $(e).attr('class'); //消去したいノードの名前
  delNode = $('[alt=' + nodeName + ']')[0]; //消去したいノードの要素
  console.log("delNode: " + delNode);
  delNodeClass = $(delNode).attr('class').split(' ');
  delNodeIf = [];
  mainCanvasHeight = $('#ns_main_canvas').attr('data-y') - 35;
  mainCanvasWidth = $('#ns_main_canvas').attr('data-x') - 35;

  split_lan = $('#ns_main_canvas').attr('class').split(/\?L_/);

  //線を削除
  $('#ns_main_canvas')[0].getContext('2d').clearRect(0, 0, $('#ns_main').width(), $('#ns_main').height());

  //delnodeにつながっているインターフェースを削除
  for (i = 0; i < split_lan.length; i++) {
    if ($(delNode).hasClass('sP_' + split_lan[i])) {
      dataLanIf = $('.eP_' + split_lan[i]).attr('data_lan_if').split(' ');

      for (j = 0; j < dataLanIf.length; j++) {
        dataLanIf[j] = dataLanIf[j].split('-');

        if (dataLanIf[j][0] === split_lan[i]) {
          //消去する要素のあとの要素を取得
          //changeElement = $('#rightInfo_IP' + split_lan[i])[0].lalt.slice(6).alt.slice(6) + '_' + dataLanIf[j][1]).parent().nextALL();
          //rightInfoから削除
          for (k = 0; k < changeElement.lengthi; k++) {
            if ($(changeElement[k]).children().hasClass('num')) {

            }
          }
        }
      }
    }
  }
}

//全要素の削除
fnAllReset = function() {
  //変数のリセット
  NS.pcNode = 0;
  NS.swNode = 0;
  NS.svNode = 0;
  NS.ruNode = 0;
  NS.lanNode = 0;
  //コンソールとトポロジーの文字を削除
  $('#ns_right dl').html("");
  $('#ns_console').html("");

  //lanLinkがあるとき
  if ($('#ns_main .ui-draggable').hasClass('lanLink')) {}

  //画像と線の削除
  $('#ns_main img').remove();
  //$('.bus').remove();
  $('#ns_main_canvas').removeClass();
  $('#ns_main_canvas').attr('data-buslan', '');
  NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

}
