//mainファイル

//他のファイルが読み込まれてからこのファイルを読み込む
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){
  /*
   * ネットワークシミュレータのプログラム
   * メインのコードを書いている
   *
   * do: 最低限の動作を作成完了
   *     データを渡すアルゴリズムがまだ最低限の仕様なので、改良予定
   *
   * bg: 勝手に線が消える (時間を置くと消える･･･? しかも消えた線が勝手に復活する･･･ 原因不明 Canvasの仕様?)(中)
   *
   *primaryコード
   *0→中継ノード
   *1→ルーター
   *2→クライアント
   *3→サーバー
   全部jsonではきだす
   プロセス間通信
   ルーティングテーブル

   文字列を入れる

   12月まで
   １問題選択
   問題選択画面を出す（データベースに問題番号送信）
   正解した問題には目印をつける（問題を開いたときに取得）
   ２回答
   回答データ送信
   ３終了
   点数出力（？）
   ロールについて
   ページ開いたとき前回の成績を反映
   終了ボタンを押したときに成績を表示・
   node-if-lan
   divを追加する時
   ・main-canvasに追加する場合 -> x +
   */

    //初期位置に戻す
    $('html').scrollTop(0);
    $('html').scrollLeft(0);



  // 関数の定義


  //ns-nav Fnction

  // 全要素の削除
  fnAllReset = function() {
    // 変数のリセット
    NS.pcNode  = 0;
    NS.swNode  = 0;
    NS.svNode  = 0;
    NS.ruNode  = 0;
    NS.lanNode = 0;
    // コンソールとトポロジーの文字を削除
    $("#ns-right dl").html("");
    $("#ns-console").html("");
    // lanLinkがある時
    if($("#ns-main .ui-draggable").hasClass("lanLink")) {
      $("#ns-main").off("mousedown", fnLanMoveDown);
      $("#ns-main").off("mouseup", fnLanMoveUp);
      $("html").off("mouseup", fnLanMoveOutUp);
    }
    // 画像と線の削除
    $("#ns-main img").remove();
    $('.bus').remove();
    $('#ns-main-canvas').removeClass();
    $('#ns-main-canvas').attr('data-buslan', '');
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
  }

  // パケット画像の変更
  fnPacketChenge = function(set1, set2, set3) {
    if($("#"+ set1 +"-packet").attr("src") === "/assets/"+ set1 +"_1.png") {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_2.png");
      if($("#"+ set2 +"-packet").attr("src") === "/assets/"+ set2 +"_2.png") {
        $("#"+ set2 +"-packet").attr("src", "/assets/"+ set2 +"_1.png");
      }
      else if($("#"+ set3 +"-packet").attr("src") === "/assets/"+ set3 +"_2.png") {
        $("#"+ set3 +"-packet").attr("src", "/assets/"+ set3 +"_1.png");
      }
    }
    else {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_1.png");
    }
  }

  // パケットの追加
  fnPacketAdd = function() {
    var elthis = $(this);
    // get-nodeを付加する処理
    if($("#get-packet").attr("src") === "/assets/get_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) { }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) {
        elthis.removeClass("send-node");
        elthis.prev().remove();
        fnSetBadge(this, "get-node");
      }
      // get-node と send-nodeがないとき
      else {
        fnSetBadge(this, "get-node");
      }
    }
    // send-nodeを付加する処理
    else if($("#send-packet").attr("src") === "/assets/send_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) {
        $(".send-node").prev().remove();
        $("#ns-main img").removeClass("send-node");
        elthis.removeClass("get-node");
        elthis.prev().remove();
        fnSetBadge(this, "send-node");
      }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) { }
      // get-node と send-nodeがないとき
      else {
        $(".send-node").prev().remove();
        $("#ns-main img").removeClass("send-node");
        fnSetBadge(this, "send-node");
      }
    }
    // nodeをリセットする処理
    else if($("#reset-packet").attr("src") === "/assets/reset_2.png") {
      if(elthis.hasClass("get-node") || elthis.hasClass("send-node")) {
        elthis.prev().remove();
        elthis.removeClass("get-node");
        elthis.removeClass("send-node");
      }
    }
  }

  // GlayLayerを表示 (New)
  fnGlayOpen = function() {
    // glayLayerのフラグを true にする
    NS.bGlayFladg = true;
    // ID glayLayerの座標と大きさの指定
    $("#glayLayer").css({
      display: 'block',
    });
    $("#glayLayer").animate({
      top:    $("#ns-container").offset().top,
      left:   $("#ns-container").offset().left,
      height: $("#ns-container").height() - 4,
      width:  $("#ns-container").width() - 4,
    }, 500);
  }

  // 左矢印ボタンが押されたとき
  fnGlayInfoLeft = function() {
    $("#slideUl:not(:animated)")
    .css("margin-left", -1*$("#slideUl li").width())
    .prepend($("#slideUl li:last-child"))
    .animate({
      "margin-left" : 0
    }, function(){ });
  }

  // 右矢印ボタンが押されたとき
  fnGlayInfoRight = function() {
    $("#slideUl:not(:animated)").animate({
      "margin-left" : -1*$("#slideUl li").width()
    }, function(){
      $("#slideUl").css("margin-left", "0");
      $("#slideUl").append($("#slideUl li:first-child"));
    });
  }

  // 問題のタイトルを押されたとき (Update)
  fnGlayStudyTitleInfo = function() {
    $("#studyLeftTitle").text($(this).text());
  }

  // 閉じるボタンが押されたとき (Update)
  fnAllGlayClose = function() {
    // 変数のリセット
    NS.bGlayFladg = false;
    // イベントハンドラの削除
    $("#infoLeft").off('click', fnGlayInfoLeft);
    $("#infoRight").off('click', fnGlayInfoRight);
    $("#glayClose").off('click', fnAllGlayClose);
    $("#studyMenuButtonIn").off('click', fnGlayStudyInput);
    $("#studyMenuButtonOut").off('click', fnGlayStudyOutput);
    // GlayLayerを設定
    $("#glayLayer").css({'display':'none','height':0});
    $("#glayLayer").empty();
  }

  fnQuestionSelectClose = function() {
    // イベントハンドラの削除
    //$("#questionClose").off('click', fnAllGlayClose);
    // GlayLayerを設定
    $("#questionLayer").css({'display':'none','height':0});
    $("#questionLayer").empty();
    // $("#check").on('click', NS.IndicateNodeInfo);
    // $("#study").on('click', fnstudy);
    // $("#save").on('click', fnsave);
    // $("#load").on('click', fnload);
    // $("#quit").on('click', fnquit);
  }

  //lanボタンが押された時
  NS.changeLanMode = function () {
    fnAllGlayClose();
    fnQuestionSelectClose();
    var elHtml     = $("html");
    var elMain     = $("#ns-main");
    var elMainDrag = $("#ns-main .ui-draggable");
    // OFFのとき
    if($('#lan').attr("src") === "/assets/lanCable.png") {
      // 画像を ONに変更
      $('#lan').attr("src", "/assets/lanCable_2.png");
      // イベントハンドラーを付ける
      elMain.on("mousedown", fnLanDown);
      elMain.on("mouseup", fnLanUp);
      elHtml.on("mouseup", fnLanOutUp);
      // elMain.on("mousedown", fnBusDown);
      // elMain.on("mouseup", fnBusUp);
      // elHtml.on("mouseup", fnBusOutUp);
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.off("mousedown", fnLanMoveDown);
        elMain.off("mouseup", fnLanMoveUp);
        elHtml.off("mouseup", fnLanMoveOutUp);
      //   elMain.off("mousedown", fnBusMoveDown);
      //   elMain.off("mouseup", fnBusMoveUp);
      //   elHtml.off("mouseup", fnBusMoveOutUp);
      }
      // カーソルの変更
      elMain.css("cursor", "crosshair");
      elMainDrag.css("cursor", "crosshair");
      // 画像のドラッグ防止
      elMainDrag.mouseup(function(e) { e.preventDefault(); });
      elMainDrag.mousedown(function(e) { e.preventDefault(); });
      // 画像にマウスが乗った時の動作
      elMainDrag.mouseenter(function(){
        // フラグの設定
        NS.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        // フラグの設定
        NS.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
      //busをoffにする
      $('#bus').prop('checked',false);
      $("#ns-main").off("mousedown", fnBusDown);
      $("#ns-main").off("mouseup", fnBusUp);
      $("html").off("mouseup", fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    // ONのとき
    else if($('#lan').attr("src") === "/assets/lanCable_2.png") {
      // 画像を OFFに変更
      $('#lan').attr("src", "/assets/lanCable.png");
      // イベントハンドラーの削除
      elMain.off("mousedown", fnLanDown);
      elMain.off("mouseup", fnLanUp);
      elHtml.off("mouseup", fnLanOutUp);
      elMainDrag.off("mouseenter").off("mouseleave");
      // カーソルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.on("mousedown", fnLanMoveDown);
        elMain.on("mouseup", fnLanMoveUp);
        elHtml.on("mouseup", fnLanMoveOutUp);
      }
    }
  }

  //トポロジーを再構成
  fnReconstructionTopology = function (Qdata) {


    $('#ns-main-canvas').attr('class', Qdata.lanInfo);
    $('#ns-main-canvas').attr('data-buslan', Qdata.busInfo);
    // 座標を計算する（winsow.offsetはスクロールしたときの座標を加味している）
    var positionX = NS.mainCanvasX;	// 要素のX座標
    var positionY = NS.mainCanvasY;	// 要素のY座標

    //main-canvasにnode出力
    for(i = 0; i < Qdata.nodeInfo.length; i++){
      //positionX += positionX / 105; //X軸位置調整
      //positionY += positionY / 58;  //Y軸位置調整
      var style_positionX = positionX + Qdata.nodeInfo[i].x;
      var style_positionY = positionY + Qdata.nodeInfo[i].y;

      if (Qdata.nodeInfo[i].name.substr(0,2) === 'PC') {
        NS.pcNode++;
        $('#ns-main').append(
          $('<img>').attr({
            src: "/assets/pc.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#ns-right dl').append('<dt><img src= /assets/plus.jpg> <span>' + Qdata.nodeInfo[i].name + '</span></dt>' +
        '<dd><p class="rightInfo-IPSM">IP-0: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].ip + '</span> /<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].sm + '</span></p>' +
        '<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].ip + '</span>/' +
        '<span id="rightInfo-PCroutingtable-SM' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].sm + '</span><br>→' +
        '<span id="rightInfo-PCroutingtable-NHA' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].nha + '</span>：IF' +
        '<span id="rightInfo-PCroutingtable-IF' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].if + '</span></p></dd>');

        //readolyクラスをつける
        // for(j = 0; j  < Qdata.nodeInfo[i].readonly.length; j++){
        //   $('#ns-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }

      }
      else if (Qdata.nodeInfo[i].name.substr(0,6) === 'Router'){
        NS.ruNode++;
        $('#ns-main').append(
          $('<img>').attr({
            src: "/assets/router.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#ns-right dl').append('<dt style=""><img src="/assets/plus.jpg"><span>' + Qdata.nodeInfo[i].name + '</span></dt><dd></dd>');


        $('#ns-right dl dd:last-child').append('<div class="rightInfo-IPSM"></div>');
        for(j=0; j < Qdata.nodeInfo[i].ip.length; j++){
          $('#ns-right dl dd:last-child').append('<p class="rightInfo-IPSM"><span id="' + j + '"class="num">IP-' + j + '</span>: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].ip[j] + '</span>' +
          '/<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j +'">' + Qdata.nodeInfo[i].sm[j] + '</span></p>');
        }

        for(j=0; j < Qdata.nodeInfo[i].routingtable.length; j++){
          $('#ns-right dl dd:last-child').append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].ip + '</span>' +
          '/<span id="rightInfo-routingtable-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].sm + '</span>' +
          '<br>→<span id="rightInfo-routingtable-NHA' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].nha + '</span>' +
          '：IF<span id="rightInfo-routingtable-IF' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].if + '</span></p></dd>');
        }



        //readolyクラスをつける
        // for(j=0; j  < Qdata.lanInfo[i].readonly.length; j++){
        //   $('#ns-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }


      }
      else {
        $('#ns-main').append(
          $('<div>').attr({
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;  width: ' + Qdata.nodeInfo[i].width + 'px; height: ' + Qdata.nodeInfo[i].height + 'px;'
          }));
      }

      //ns-rightの情報を隠す
      $("#ns-right dd:last").css("display","none");

      //画像をドラッグできるようにする
      $("#ns-main img:last-child").draggable({
        containment: 'parent',
        zIndex: 2,
        // ドラッグ中
        drag: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().offset({
              top:  this.offsetTop - 15,
              left: this.offsetLeft + 42,
            });
            $(this).prev().css('zIndex', 3);
          }
        },
        // // ドラッグ終了
        stop: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().css('zIndex', 1);
          }
        },
      });


      //実際に配置されたときの配置を取得（slice()でpxを削除）
      // Qdata.nodeInfo[i].positionX = $('#ns-main img:last-child')[0].style.left.slice(0, -2);
      // Qdata.nodeInfo[i].positionY = $('#ns-main img:last-child')[0].style.top.slice(0, -2);
    }

    fnDraw();

    //ns-rightの情報を隠す
    $("#ns-right dd:last").css("display","none");

    //イベントハンドラを付けるためにLanModeを切り替える（2回切り替えて元に戻している）（改良して）
    NS.changeLanMode();
    NS.changeLanMode();
  }

  //問題を選択
  fnstudySelect = function () {

    //タイトルを取得
    NS.question_id = $(this).attr('data-qid');


    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/sample2.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{question_id : NS.question_id, id : NS.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      fnAllReset();
      $("#ns-console").append("<p>> 問題を取得しました </p>");
      //トポロジーを再現
      fnReconstructionTopology(Qdata);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      fnQuestionSelectClose();
      // イベントハンドラの追加と削除
      $("#questionClose").off('click', fnQuestionSelectClose);
      $("#studySelect").off('click', fnstudySelect);
      $(".qusetion-select-button").off('click', fnstudySelect);
      // $("#check").on('click', NS.IndicateNodeInfo);
      // $("#study").on('click', fnstudy);
      // $("#save").on('click', fnsave);
      // $("#load").on('click', fnload);
      // $("#quit").on('click', fnquit);
    });
  }

  //トポロジーをロード
  fnloadSelect = function () {
    //タイトル取得
    // var studyTitleValue = $("#studySelectTitle").val();

    NS.question_id = $(this).attr('data-qid');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/sample2.json',
      //moodleで動かす場合は上をコメントアウトして下を使う
      //url: 'NewNetworkSimulator/fntemporary_load.php',
      data:{question_id : NS.question_id, id : NS.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      fnAllReset();
      $("#ns-console").append("<p>>トポロジーを読み込みました</p>");
      //トポロジーを再現
      fnReconstructionTopology(Qdata);

    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){ fnQuestionSelectClose(); });

  }

  //モードを切り替える
  fnchangeMode = function () {

    //全削除
    fnAllReset();

    //自由描画モードのとき
    if ($(".change_mode").hasClass('draw')) {

      //ns-navに追加
      $("#ns-nav :nth-of-type(8)")
      .after("<div class='tooltip tooltip_study add_nav'><img src='/assets/study.png' id='study' title='練習問題'><span>問題を表示します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_save add_nav'><img src='/assets/save.png' id='save' title='セーブ'><span>現在のネットワーク構成を保存します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_load add_nav'><img src='/assets/load.png' id='load' title='ロード'><span>セーブした問題のネットワーク構成を復元します</span></div>" +
      "<div class='add_height_line add_nav' id='add_line'></div>" +
      "<div class='tooltip tooltip_quit add_nav'><img src='/assets/quit.png' id='quit' title='終了'><span>問題演習を終了します</span></div>" +
      "<div class='add_height_line' id='line'></div>");

      //イベントハンドラを付ける
      $("#study").on('click', fnstudy);
      $("#save").on('click', fnsave);
      $("#load").on('click', fnload);
      $("#quit").on('click', fnquit);

      //dustのイベントハンドラを削除
      $("#dust").attr("src", "/assets/dust2.png");
      $("#dust").off('click', fnAllReset);

      //ns-leftのイベントハンドラを削除
      // $('.machinery').draggable('destroy')
      // $('.tgl').prop('disabled', true);
      // $('#lan').off();

      //問題を出力する場所を生成
      $("#ns-all").after("<div id='question'>問題：<span></span><form id='questiontext'>" +
      "<textarea name='txt' rows='3' cols='146' readonly></textarea></form></div>");

    }
    else if ($(".change_mode").hasClass('question')) {

      //追加したnavを削除
      $("#study").remove();
      $("#save").remove();
      $("#load").remove();
      $("#quit").remove();
      $(".add_height_line").remove();
      $("#question").remove();
      //dustにイベントハンドラを付ける
      $("#dust").attr("src", "/assets/dust.png");
      $("#dust").on('click', fnAllReset);
      // // machineryをドラッグ
      // $(".machinery").draggable({
      //   helper: 'clone',  // 要素を複製する
      //   revert: true,     // ドラッグ終了時に要素に戻る
      //   zIndex: 3,
      //   // ドラッグ開始
      //   start: function(e, ui) { $(this).addClass('dragout'); },
      //   // ドラッグ終了
      //   stop: function(e, ui) { $(this).removeClass('dragout'); },
      // });
      // // lanをクリック
      // $("#lan").click(function(){
      //   NS.changeLanMode();
      // });
      // // LANのスター型とバス型をクリック
      // $('.tgl').prop('disabled', false);


      fnQuestionSelectClose();
    }
  }

  //studyをクリック（問題一覧を表示）
  fnstudy = function () {
    studyTitleValue = 0;
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/ques.json',
      // url: 'NewNetworkSimulator/php/collect_questions_title.php',
      data:{question_id :$('#question span').innerHTML, id : NS.urlparameter}
    }).done(function(data) {

      fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">練習問題</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-select-button tr' + Qdata[i].grade + '" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }



    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      // イベントハンドラの追加と削除
      $("#questionClose").on('click', fnQuestionSelectClose);
      $("#studySelect").on('click', fnstudySelect);
      $(".qusetion-select-button").on('click', fnstudySelect);
      // $("#check").off('click', NS.IndicateNodeInfo);
      // $("#study").off('click', fnstudy);
      // $("#save").off('click', fnsave);
      // $("#load").off('click', fnload);
      // $("#quit").off('click', fnquit);
    });
  }

  //ここから
  //saveをクリック 解読するならここからがオススメ
  fnsave = function () {
    if ( typeof NSFCSA === "undefined" ) var NSFCSA = {};

      router = [];          //routerの構造体配列
      pc = [];              //pcの構造体配列
      bus = [];
      save = new Object();
      save.nodeInfo = [];
      save.pair = [];

      //コンストラクタのようなもの
      function router_const(){
        this.name = '';
        this.ip = [];
        this.sm = [];
        this.destinationRoute = [];
        this.if = [];
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function pc_const(){
        this.name = '';
        this.ip = '';
        this.sm = '';
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function bus_const() {
        this.name = '';
        this.x = '';
        this.y = '';
        this.width = '';
        this.height = '';
        this.class = '';
      }

    //lanLinkがあるとき
    if ($('#ns-main img').hasClass('lanLink')) {


      //Routerのname
      $('#ns-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#ns-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          console.log(e);
          if (j % 3 == 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 == 2) {
            router[i].sm[count] = $(e).text();
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < router.length; i++){
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e) {
          router[i].class = $(e).attr('class');
          router[i].ifnum = $(e).attr('data-ifnum');
          router[i].lanif = $(e).attr('data-lan-if');
          router[i].linknum = $(e).attr('data-linknum');
          router[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }


      //pcのname, ip, smを取得
      $("#ns-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        //All_PC_node++;
      });

      $("#ns-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(1)").each(function(i, e) {
        pc[i].ip = $(e).text();
      });

      $("#ns-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(2)").each(function(i, e) {
        pc[i].sm = $(e).text();
      });

      //ルーティングテーブル
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          pc[i].class = $(e).attr('class');
          pc[i].ifnum = $(e).attr('data-ifnum');
          pc[i].lanif = $(e).attr('data-lan-if');
          pc[i].linknum = $(e).attr('data-linknum');
          pc[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }

      //busの情報
      $('#ns-main .bus').each(function (i, e) {
        bus[i] = new bus_const();
        bus[i].name = $(e).attr('alt');
        bus[i].class = $(e).attr('class')
        bus[i].x = e.style.left.replace("px", "") - NS.mainCanvasX;
        bus[i].y = e.style.top.replace("px", "") - NS.mainCanvasY;
        bus[i].width = e.style.width.replace("px", "");
        bus[i].height = e.style.height.replace("px", "");
      });

      //座標を取得
      $("#ns-main img").each(function(i, e) {
        for(j = 0, count = 0; j < router.length; j++){
          if (router[j].name === e.alt) {
            router[j].x = e.style.left.replace("px", "") - NS.mainCanvasX;
            router[j].y = e.style.top.replace("px", "") - NS.mainCanvasY;

            if ($(e).hasClass('RO_sp1')) {
              router[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sp2')) {
              router[j].readonly[count] = 'RO_sp2';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              router[j].readonly[count] = 'RO_sm1';
              count++;
            }

            if ($(e).hasClass('RO_sm2')) {
              router[j].readonly[count] = 'RO_sm2';
              count++;
            }
          }
        }
        for(j = 0, count = 0; j < pc.length; j++){
          if (pc[j].name === e.alt) {
            pc[j].x = e.style.left.replace("px", "") - NS.mainCanvasX;
            pc[j].y = e.style.top.replace("px", "") - NS.mainCanvasY;

            //readonlyのセーブデータ
            if ($(e).hasClass('RO_sp1')) {
              pc[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              pc[j].readonly[count] = 'RO_sm1';
              count++;
            }
          }
        }
      });

      console.log(router);


      //saveDataを作成
      save.id = $("#question span")[0].textContent;
      save.text = questiontext.txt.value;

      //PCのセーブデータを作成
      for(i = 0; i < pc.length; i++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = pc[i];
        // save.data[i].name = pc[i].name;
        // save.data[i].ip = pc[i].ip;
        // save.data[i].sm = pc[i].sm;
        // save.data[i].coordinateX = pc[i].x;
        // save.data[i].coordinateY = pc[i].y;
        // save.data[i].readonly = pc[i].readonly;
      }

      //Routerのセーブデータを作成
      for(i = pc.length, j = 0; i < pc.length + router.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = router[j];
        // save.data[i].name = router[j].name;
        // save.data[i].coordinateX = router[j].x;
        // save.data[i].coordinateY = router[j].y;
        // save.data[i].readonly = router[j].readonly;
        // save.data[i].ip = [];
        // save.data[i].sm = [];
        //
        // for(k=0; k < router[j].ip.length; k++){
        //   save.data[i].ip[k] = router[j].ip[k];
        //   save.data[i].sm[k] = router[j].sm[k];
        // }
        //
        // save.data[i].routingtable = [];
        // for(k=0; k < router[j].routingtable.length; k++){
        //   save.data[i].routingtable[k] = new Object();
        //   save.data[i].routingtable[k].if = router[j].routingtable[k].if;
        //   save.data[i].routingtable[k].ip = router[j].routingtable[k].ip;
        //   save.data[i].routingtable[k].sm = router[j].routingtable[k].sm;
        //   save.data[i].routingtable[k].nha = router[j].routingtable[k].nha;
        // }
      }

      //busのセーブデータ作成
      for(i=pc.length+router.length, j=0; i < pc.length + router.length + bus.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = bus[j];
      }


      //lanの情報を取得
      lan_info = $('#ns-main canvas').attr('class');
      save.lanInfo = $('#ns-main canvas').attr('class');
      save.busInfo =  $('#ns-main canvas').attr('data-buslan');


      JsonsaveData = JSON.stringify(save, null, " ");
      console.log(JsonsaveData);



      $.ajax({
        type: 'POST',
        dataType: 'text',
        url: '/assets/save_DB.php',
        // url: 'NewNetworkSimulator/php/save_DB.php',
        data:{postJsonData : JsonsaveData, id : NS.urlparameter, question_id : NS.question_id}
      }).done(function(data) {
        $("#ns-console").append("<p>>ノードの配置を保存しました  </p>");
      }).fail(function(XMLHttpRequest, textStatus) {
        $("#ns-console").append("<p>> エラーが発生しました</p>");
      }).always(function(){});
    }
  }

  //loadをクリック
  fnload = function () {
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/ques.json',
      // url: 'NewNetworkSimulator/php/temporary_load_title.php',
      data:{id : NS.urlparameter}
    }).done(function(data) {


      fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      $('#questionLayer').append('<div class="points" align="center">ロード</div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-load-button tr0" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }


      // イベントハンドラの追加
      $("#questionClose").on('click', fnQuestionSelectClose);
      $("#studySelect").on('click', fnstudySelect);
      $(".qusetion-load-button").on('click', fnloadSelect);
      // $("#study").off('click', fnstudy);
      // $("#save").off('click', fnsave);
      // $("#load").off('click', fnload);
      // $("#quit").off('click', fnquit);
    });
  }

  //quitボタンをクリック
  fnquit = function () {

    fnchangeMode();
    $('#mode_draw').prop('checked', true);
    $('.change_mode').removeClass('question');
    $('.change_mode').addClass('draw');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/quit.json',
      // url: 'NewNetworkSimulator/php/push_quit.php',
      data:{id : NS.urlparameter}
    }).done(function(Qdata) {

      console.log(Qdata);

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(Qdata);

      console.log(Qdata);

      // GlayLayerを表示
      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#ns-main").offset().top,
        left:   $("#ns-main").offset().left,
        height: $("#ns-main").height(),
        width:  $("#ns-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">points:' + Qdata[0].point + '</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=1; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<p class="quitText qtr' + Qdata[i].grade + '">' + Qdata[i].title + '</p>');
      }

      // イベントハンドラの追加
      $("#questionClose").on('click', fnQuestionSelectClose);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#ns-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){});


  }


  //Nodeの情報を表示
  NS.IndicateNodeInfo = function () {

    var nodes = [];

    //nodeの情報を取得
    for(i = 0, num = 0; i < $("#ns-main img").length; i++){
      element = $("#ns-main img")[i];
      if ($(element).hasClass('send-node2') !== true && $(element).hasClass('get-node2') !== true) {
        nodes[num] = new Object();
        nodes[num].element = element;
        num++;
      }
    }

    for(i = 0; i < nodes.length; i++){
      info_height = 20;
      ddElements = $('#ns-right dt:contains(' + nodes[i].element.alt + ') + dd').clone();
      pElements =  $('#ns-right dt:contains(' + nodes[i].element.alt + ') + dd p').clone();

      if (nodes[i].element.alt.slice(0, 2) == 'PC') {
        info_height = 80;
        info_width = 170;
      }
      else {
        for(j=0; j < pElements.length; j++){
          if (pElements[j].className == 'rightInfo-IPSM') {
            info_height += 20;
          }
          else {
            info_height += 40;
          }
        }
        info_width = 170;
      }
      nodeX = nodes[i].element.x + 35 - NS.mainCanvasX;
      nodeY = nodes[i].element.y + 35 - NS.mainCanvasY;
      rightInfoX = $('#ns-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetLeft;
      rightInfoY = $('#ns-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetTop;


      $("#checkLayer").append(
        $('<div>').attr({
          class: 'info',
          style: 'position: absolute; top: ' + nodeY + 'px; left: ' + nodeX + 'px; width:' + info_width + 'px; height:' + info_height + 'px;'

        }));

      $("#checkLayer div:last-child").append("<p>" + nodes[i].element.alt + "</p>");
      $("#checkLayer div:last-child").append(ddElements)

    }
  }

  // ns-main Fnction

  // 画像を追加
  fnMainDrop = function(ui, obj) {
    // 機種の判別
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      NS.dropNodeInt = NS.pcNode;
      NS.dropNodeName = "PC"+ NS.pcNode;
      NS.dropContextName = "context-menu-PC";
      NS.pcNode++;
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      NS.dropNodeInt = NS.ruNode;
      NS.dropNodeName = "Router"+ NS.ruNode;
      NS.dropContextName = "context-menu-Router";
      NS.ruNode++;
    }
    // ns-mainに画像を追加 (clssとstyleの設定の追加)
    $("#ns-main").append(
      $("<img>").attr({
      src: ui.draggable.attr("src"),
      alt: NS.dropNodeName,
      class: NS.dropContextName,
      'data-ifnum': 0,
      'data-lan-if': '',
      'data-routingtablenum':0,
      'data-linknum': 0,
      style: "position: absolute; top: "+ ui.offset.top +"px; left: "+ ui.offset.left +"px",
    }));
    $("#ns-main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');
    // ns-mainの画像にdraggableを付ける
    $("#ns-main img:last-child").draggable({
      containment: 'parent',
      zIndex: 2,
      // ドラッグ中
      drag: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().offset({
            top:  this.offsetTop - 15,
            left: this.offsetLeft + 42,
          });
          $(this).prev().css('zIndex', 3);
        }
      },
      // // ドラッグ終了
      stop: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().css('zIndex', 1);
        }
      },
    });
    //context-menuに名前を追加
    //$(obj[0].lastChild).data().name = NS.dropNodeName;
    // LANが ONのとき画像を動かなくする
    if($("#lan").attr("src") === "/assets/lanCable_2.png") {
      var elMainImgLast = $("#ns-main img:last-child");
      elMainImgLast.css("cursor", "crosshair");
      elMainImgLast.mouseup(function(e) { e.preventDefault(); });
      elMainImgLast.mousedown(function(e) { e.preventDefault(); });
      elMainImgLast.mouseenter(function(){
        NS.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        NS.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
    }
    // ns-rightにトポロジを追加
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      $("#ns-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NS.dropNodeInt +"</span></dt>" +
      "<dd><p class='rightInfo-IPSM'>IP-0: <span id='rightInfo-IP" + NS.dropNodeInt + "'></span> /<span id='rightInfo-SM" + NS.dropNodeInt + "'></span></p></dd>");

      $('#ns-right dt:contains("'+ ui.draggable.attr("alt") + NS.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + NS.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-PCroutingtable-SM' + NS.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-PCroutingtable-NHA' + NS.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-PCroutingtable-IF' + NS.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      $("#ns-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NS.dropNodeInt +"</span></dt><dd><div class='rightInfo-IPSM'></div></dd>");

      $('#ns-right dt:contains("'+ ui.draggable.attr("alt") + NS.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + NS.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-routingtable-SM' + NS.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-routingtable-NHA' + NS.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-routingtable-IF' + NS.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    // dd要素(IPとSM)を隠す
    $("#ns-right dd:last").css("display","none");
    fnNameDraw(ui.draggable.attr('alt') + NS.dropNodeInt);
  }


  // ns-canvas Function

  // マウスのボタンが押されたときに処理を実行する関数
  fnLanDown = function(e) {
    // imgにマウスが乗っているとき
    if(NS.lanFlag && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      // PCに線が引かれているとき
      if($(e.target).attr("src") === "/assets/pc.png" && $(e.target).hasClass("lanLink")) {
        $("#ns-console").append("<p>> PCにLANは1本しか引けません。</p>");
      }
      else {
        // canvasの追加
        NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns-main');
        NS.lanFlagPoint = true;
        // lanLinkがある場合
        if($(this).children(".lanOn").hasClass("lanLink")) {
          NS.lanFlaglink = true;
        }
        // Classの追加
        $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NS.lanNode);
        //$('#ns-main-canvas').addClass("L_"+ NS.lanNode);
        // マウスを押した場所の座標
        NS.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
        //busから線を引いた時のフラグ
        if ($('.sP_' + NS.lanNode).hasClass('bus')) {
          NS.busFlag = true;
        }
        // 関数 lanDragの呼び出し
        $("#ns-main").on("mousemove", fnLanDrag);
      }
    }
  }

  fnBusDown = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0 && $('.lanFirst').length == 0 && $('.bus-mouseover').length == 0) {
      NS.points = [];
      NS.addCanvas = $('<canvas width="' + NS.canvasWidth + '" height="' + NS.canvasHeight + '"></canvas>').prependTo('#ns-main');
      $("#ns-main").on("mousemove", fnBusDrag);
      $('#ns-main').on('mouseup', fnBusUp);
      $("html").on("mouseup", fnBusOutUp);
      NS.busDrawFrag = true;
    }
  }

  // マウスが移動したときに処理を実行する関数
  fnLanDrag = function(e) {
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    // 線の色の変更
    if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      NS.addCtx.strokeStyle = '#2fb9fe';
    }
    else {
      NS.addCtx.strokeStyle = '#fb9003';
    }
    NS.addCtx.lineWidth = NS.lanWidth;
    NS.addCtx.moveTo(NS.points[0].x, NS.points[0].y);
    NS.addCtx.lineTo(NS.points[NS.points.length - 1].x, NS.points[NS.points.length - 1].y);
    NS.addCtx.stroke();
  }

  fnBusDrag = function (e) {
    NS.addCtx = NS.addCanvas.get(0).getContext('2d');
    NS.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NS.addCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    NS.addCtx.beginPath();
    NS.addCtx.strokeRect(NS.points[0].x, NS.points[0].y, NS.points[NS.points.length - 1].x - NS.points[0].x, 10);
  }

  // マウスのボタンが離されたときに処理を実行する関数
  fnLanUp = function(e) {
    if(NS.lanFlagPoint && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      NS.lanFlagDelet = true;
      // マウスを押してドラッグしなかったとき || 画像の上に載ってないとき || 最初の画像のとき
      if(NS.points.length === 1 || (NS.lanFlag === false) || $(e.target).hasClass("lanFirst")) {
          if(NS.lanFlaglink === true) {
            $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
          }
          else {
            $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
          }
          $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
          NS.lanFlagDelet = false;
          NS.lanNode--;
      }
      else if (NS.busFlag == true && $(e.target).hasClass('bus')) {
        $("#ns-console").append("<p>> busとbusは繋げません</p>");
        if(NS.lanFlaglink === true) {
          $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
        }
        else {
          $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
        }
        $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
        NS.lanFlagDelet = false;
        NS.lanNode--;
      }
      // PCにもう線が引かれているとき
      else if($(e.target).hasClass("lanLink") && $(e.target).attr("src") === "/assets/pc.png") {
        if(NS.lanFlaglink === true) {
          $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
        }
        else {
          $(".sP_"+ NS.lanNode).removeClass("lanLink sP_"+ NS.lanNode);
        }
        $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
        $("#ns-console").append("<p>> PCにLANは1本しか引けません。</p>");
        NS.lanFlagDelet = false;
        NS.lanNode--;
      }
      // 同じ場所に線を引かないようにする
      else {
        for(var i = 0; i < NS.lanNode; i++) {
          if(($(".lanFirst").hasClass("sP_"+ i) && $(".lanOn").hasClass("eP_"+ i)) ||
             ($(".lanFirst").hasClass("eP_"+ i) && $(".lanOn").hasClass("sP_"+ i))) {
              $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
              $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
              $("#ns-console").append("<p>> 同じ所にLANは引けません。</p>");
              NS.lanFlagDelet = false;
              NS.lanNode--;
              break;
          }
        }
      }

      // 画像の真ん中に線を持ってくる動作アンドモア
      if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn") && NS.lanFlagDelet) {
        NS.lanArrWidth[NS.lanNode] = NS.lanWidth;
        $(".lanOn").addClass("lanLink eP_"+ NS.lanNode);

        // $('.sP_' + NS.lanNode).addClass('Lan' + NS.lanNode);
        // $('.eP_' + NS.lanNode).addClass('Lan' + NS.lanNode);

        $('#ns-main-canvas').addClass("L_"+ NS.lanNode);
        spifnum =  parseInt($('.sP_' + NS.lanNode).attr('data-ifnum'));
        spifnum += 1;
        epifnum =  parseInt($('.eP_' + NS.lanNode).attr('data-ifnum'));
        epifnum += 1;

        //buslanの追加
        if ($('.sP_' + NS.lanNode).hasClass('bus') ||  $('.eP_' + NS.lanNode).hasClass('bus')){
          if ($('#ns-main-canvas').attr('data-buslan') == undefined) {
            $('#ns-main-canvas').attr('data-buslan', 'B_' + NS.lanNode);
          }
          else {
            tmp = $('#ns-main-canvas').attr('data-buslan');
            tmp += ' ' + 'B_' + NS.lanNode;
            $('#ns-main-canvas').attr('data-buslan', tmp);
          }
        }

        //lanとifの結びつけ
        if ($('.sP_' + NS.lanNode).hasClass('bus') == false) {
          if ($('.sP_' + NS.lanNode).attr('data-lan-if') == '') {
            tmp =  $('.sP_' + NS.lanNode).attr('data-lan-if');
            tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
            $('.sP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.sP_' + NS.lanNode).attr('data-lan-if') != '') {
            tmp =  $('.sP_' + NS.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NS.lanNode + '-' + $('.sP_' + NS.lanNode).attr('data-ifnum');
            $('.sP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.sP_' + NS.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.sP_' + NS.lanNode).attr('data-linknum', tmp);

        }
        if ($('.eP_' + NS.lanNode).hasClass('bus') == false) {
          if ($('.eP_' + NS.lanNode).attr('data-lan-if') == "") {
            tmp =  $('.eP_' + NS.lanNode).attr('data-lan-if');
            tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
            $('.eP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.eP_' + NS.lanNode).attr('data-lan-if') != "") {
            tmp =  $('.eP_' + NS.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NS.lanNode + '-' + $('.eP_' + NS.lanNode).attr('data-ifnum');
            $('.eP_' + NS.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.eP_' + NS.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.eP_' + NS.lanNode).attr('data-linknum', tmp);
        }


        //rightinfoに追加
        //router->router
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#ns-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NS.lanNode).attr('data-ifnum',spifnum);

          $('#ns-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

        }

        //pc,bus->router
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#ns-right dl dt:contains("' + $('.eP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NS.lanNode).attr('data-ifnum', epifnum);

        }

        //router->pc,bus
        if ($('.sP_' + NS.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NS.lanNode).attr('alt').substr(0, 6) !== 'Router') {
          $('#ns-right dl dt:contains("' + $('.sP_' + NS.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NS.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NS.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NS.lanNode).attr('data-ifnum',spifnum);
        }

        //描画
        fnIfDraw();
        fnLanDraw();
      }

      // 変数とフラグを設定
      NS.lanNode++;
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
      NS.busFlag = false;
      NS.addCanvas.remove();
      // イベントハンドラの削除
      $("#ns-main").off("mousemove", NS.lanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
    }
  }

  fnBusUp = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0) {
      //始点と終点の位置
      if (NS.points[NS.points.length - 1].x - NS.points[0].x > 0) {
        x = NS.points[0].x + NS.mainCanvasX;
        y = NS.points[0].y + NS.mainCanvasY;
        width = NS.points[NS.points.length - 1].x - NS.points[0].x;
      }
      else {
        x = NS.points[NS.points.length - 1].x + NS.mainCanvasX;
        y = NS.points[0].y + NS.mainCanvasY;
        width = NS.points[0].x - NS.points[NS.points.length - 1].x;
      }

      //divを追加
      $('#ns-main').append(
        $('<div>').attr({
          alt: 'bus' + NS.busNode,
          class: 'bus',
          'data-bus': '',
          style: 'position: absolute; top: ' + y + 'px; left: '+  x +'px; width:' + width + 'px; height:10px;',
          'oncontextmenu': 'return busscontextmenu(this)'
        }));

      $('.bus').draggable({
        containment: 'parent',
        scroll: false,
      });

      $('.bus').on('drag', fnLanMoveDrag);

      NS.points = [];
      NS.busNode++;
      NS.addCanvas.remove();
      NS.busDrawFrag = false;
      // イベントハンドラの削除
      $('#ns-main').off('mousemove', fnBusDrag);
      $('#ns-main').off('mouseup', fnBusUp);
    }
  }

  // 線を引いてる途中 ns-main以外でマウスを放した時
  fnLanOutUp = function(e) {
    if(NS.lanFlagPoint) {
      NS.addCanvas.remove();
      if(!(NS.lanFlaglink)) {
        $(".sP_"+ NS.lanNode).removeClass("lanLink");
      }
      $("#ns-main").off("mousemove", fnLanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
      $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
      // 変数とフラグをリセット
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
    }
  }

  fnBusOutUp = function(e) {
    // NS.addCanvas.remove();
    // $("#ns-main").off("mousemove", fnBusDrag);
    // // 変数とフラグをリセット
    // NS.points = [];
  }

  // マウスを押したとき (線を動かす動作)
  fnLanMoveDown = function(e) {
    // if($(e.target).hasClass("lanLink")) {
    //   NS.elLanMoveThis = $(this);
    //   NS.lanFlagMove = true;
    //   NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    //   NS.elLanMoveThis.on("mousemove", fnLanMoveDrag);
    // }
    NS.elLanMoveThis = $(this);
    NS.lanFlagMove = true;
    NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    NS.elLanMoveThis.on("mousemove", fnLanMoveDrag);
  }

  // ドラッグしている時 (線を動かす動作)
  fnLanMoveDrag = function(e) {
    NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    fnDraw();
  }

  // マウスを放した時 (線を動かす動作)
  fnLanMoveUp = function(e) {
    if(NS.lanFlagMove === true) {
      NS.lanFlagMove = false;
      NS.elLanMoveThis.off("mousemove", fnLanMoveDrag);
    }
  }

  // main以外でマウスを放した時 (線を動かす動作)
  // fnLanMoveOutUp = function(e) {
  //   if(NS.lanFlagMove === true) {
  //     NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
  //     for(var i = 1; i < NS.lanArrClass.length; i++) {
  //       //fnIfDraw(NS.lanArrClass[i]);
  //       fnLanDraw(NS.lanArrClass[i]);
  //      }
  //     NS.lanFlagMove = false;
  //     NS.elLanMoveThis.off("mousemove", fnLanMoveDrag);
  //   }
  // }


  //描画セット
  fnDraw = function () {
    fnIfDraw();
    fnLanDraw();
    fnNameDraw();
  }

  // 線の描画関数 (バス型要改良)
  fnLanDraw = function() {

    if ($('#ns-main-canvas').attr('class') != '') {
      NS.mainCtx.beginPath();
      lanNum = $('#ns-main-canvas').attr('class').split(' ');
      for(i=0; i < lanNum.length; i++){
        lanNum[i] = lanNum[i].slice(2);
      }

      //先にbusにつながっているlan
      if ($('#ns-main-canvas').attr('data-buslan') != undefined) {
        busLanNum = $('#ns-main-canvas').attr('data-buslan').split(' ');
        for(i=0; i < busLanNum.length; i++){
          busLanNum[i] = busLanNum[i].slice(2);
        }
      }
      else {
        busLanNum = '';
      }


      tmp = new Object();

      //busの数だけ描画
      if (busLanNum != '') {
        $('.bus').each(function (i, e){
          bus = new Object();
          bus.element = e;
          bus.x = e.offsetLeft + e.offsetWidth / 2;
          bus.y = e.offsetTop + e.offsetHeight / 2;
          nodes = [];

          //バスがいくつのノードとつながっているか
          for(j=0, count=0; j < busLanNum.length; j++){
            if ($(e).hasClass('sP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.eP_' + busLanNum[j]);
              nodes[count].x = $('.eP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.eP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
            else if ($(e).hasClass('eP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.sP_' + busLanNum[j]);
              nodes[count].x = $('.sP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.sP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
          }

          //バスの線より上か下か
          nodeUp = [];
          nodeDown = [];
          for(j=0, upCount=0, downCount=0; j < nodes.length; j++){
            if (bus.y - nodes[j].y >= 0) {
              nodeUp[upCount] = new Object();
              nodeUp[upCount] = nodes[j];
              upCount++;
            }
            else {
              nodeDown[downCount] = new Object();
              nodeDown[downCount] = nodes[j];
              downCount++;
            }
          }

          //右順にノードを並び替える
          for(j=0; j < nodes.length; j++){
            for(k=j+1; k < nodes.length; k++){
              if (nodes[j].x < nodes[k].x) {
                tmp = nodes[j];
                nodes[j] = nodes[k];
                nodes[k] = tmp;
              }
            }
          }

          //縦の線を描画
          for(j=0; j < nodes.length; j++){
            NS.mainCtx.moveTo(nodes[j].x - NS.mainCanvasWidth, nodes[j].y - NS.mainCanvasHeight);
            NS.mainCtx.lineTo(nodes[j].x - NS.mainCanvasWidth, bus.y - NS.mainCanvasY);
            NS.mainCtx.stroke();
          }

          //divを変形させる
          if (nodes.length > 1) {
            $(e).css({
              'left': nodes[nodes.length-1].x,
              'width': nodes[0].x - nodes[nodes.length-1].x + 70,
           });
          }
          else if(nodes.length == 1){
            $(e).css({
              'left': nodes[0].x,
              'width': 70,
           });
          }
        });
      }

      //node-to-nodeの描画
      for(i=0; i < lanNum.length; i++){
        NS.mainCtx.beginPath();
        NS.mainCtx.moveTo($(".sP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".sP_"+ lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
        NS.mainCtx.lineTo($(".eP_"+ lanNum[i])[0].offsetLeft - NS.mainCanvasWidth, $(".eP_"+ lanNum[i])[0].offsetTop - NS.mainCanvasHeight);
        NS.mainCtx.stroke();
      }
    }

  }

  //ifをcanvasに描画
  fnIfDraw = function () {

    NS.mainCtx.beginPath();
    ctx = document.getElementById('ns-main-canvas').getContext('2d');

    lanClass =  $('#ns-main-canvas').attr('class').split(/\s?L_/);

    for(lanClassNum=1; lanClassNum < lanClass.length; lanClassNum++){
      lanNum = lanClass[lanClassNum];

      //sPがbusでない
      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        spSplit = $('.sP_' + lanNum).attr('data-lan-if').split(' ');
        spLanIf = [];
        for(i=0; i < spSplit.length; i++){
          spLanIf[i] = spSplit[i].split('-')
        }
        for(i=0; i < spLanIf.length; i++){
          if (spLanIf[i][0] == lanNum) {
            spIf = 'if' + spLanIf[i][1];
          }
        }
        spX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth;
        spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        spType = $('.sP_' + lanNum).attr('alt').substr(0, 6);
      }
      //sPがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) > $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        //busが下
        else {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        spIf = ''
      }

      //ePがbusでない
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        epSplit = $('.eP_' + lanNum).attr('data-lan-if').split(' ');
        epLanIf = [];
        for(i=0; i < epSplit.length; i++){
          epLanIf[i] = epSplit[i].split('-')
        }
        for(i=0; i < epLanIf.length; i++){
          if (epLanIf[i][0] == lanNum) {
            epIf = 'if' + epLanIf[i][1];
          }
        }
        epX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth;
        epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        epType = $('.eP_' + lanNum).attr('alt').substr(0, 6);
      }
      //ePがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) < $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        //busが下
        else {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NS.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NS.mainCanvasHeight;
        }
        epIf = ''
      }

      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(spX, spY, epX, epY, spType, spIf);
      }
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(epX, epY, spX, spY, epType, epIf);
      }
    }

    function ifDraw (aX, aY, bX, bY, type, ifname) {
      if (type === 'Router') {
        //楕円と直線の交点を求める
        var s = 50;
        var t = 30;
        var a = (bY-aY) / (bX-aX);
        var x = Math.sqrt((s*s * t*t) / (t*t + a*a * s*s));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }

      }
      else {
        //円と直線の交点を求める
        var a = (bY-aY) / (bX-aX);
        var r = 50;
        var x = Math.sqrt(r*r / (1+a*a));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }
      }
    }
  }


  //ノードの名前を表示
  fnNameDraw = function () {
    NS.mainCtx.beginPath();
    ctx = document.getElementById('ns-main-canvas').getContext('2d');
    $('#ns-main img').each(function (i, e) {
      if ($(e).attr('id') != 'questionClose') {
        if ($(e)[0].alt.slice(0, 2) == 'PC') {
          drawName = $(e)[0].alt;
          x = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].x - NS.mainCanvasWidth - 10;
          y = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].y - NS.mainCanvasHeight - 35;
          ctx.fillText(drawName, x, y, 200);
        }
        else if ($(e)[0].alt.slice(0, 2) == 'Ro'){
          drawName = 'Ro' + $(e)[0].alt.slice(6);
          x = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].x - NS.mainCanvasWidth - 10;
          y = $('#ns-main img[alt="' + $(e)[0].alt + '"]')[0].y - NS.mainCanvasHeight - 20;
          ctx.fillText(drawName, x, y, 200);
        }
      }
    });
  }


  // ns-etc Fnction

  // contextMenuのcallback関数 (PC Router)
  fnConfunc = function(key, opt) {
    // 削除を押した時の動作
    if(key === "del") {
      NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      for(var i = 1; i < NS.lanArrClass.length; i++) {
        if(this.hasClass("sP_"+ NS.lanArrClass[i]))　{
          $("#ns-main img").removeClass("eP_"+ NS.lanArrClass[i]);
          $("#ns-main-canvas").removeClass("L_"+ NS.lanArrClass[i]);
          $("#ns-main img").removeClass("if_"+ NS.lanArrClass[i]);
        }
        else if(this.hasClass("eP_"+ NS.lanArrClass[i])) {
          $("#ns-main img").removeClass("sP_"+ NS.lanArrClass[i]);
          $("#ns-main-canvas").removeClass("L_"+ NS.lanArrClass[i]);
          $("#ns-main img").removeClass("if_"+ NS.lanArrClass[i]);
        }
        else {
          fnLanDraw(NS.lanArrClass[i]);
        }
      }
      if($(this).hasClass("get-node") || $(this).hasClass("send-node")) {
        $(this).prev().remove();
      }
      $(this).remove();
      $("#ns-main img:not([class*='P_'])").removeClass("lanLink");
      $("#ns-right dt:contains('"+ opt.$trigger[0].alt +"'), #ns-right dt:contains('"+ opt.$trigger[0].alt +"') + dd").remove();
      // lanLinkがないとき
      if(!($("#ns-main .ui-draggable").hasClass("lanLink"))) {
        $("#ns-main").off("mousedown", fnLanMoveDown);
        $("#ns-main").off("mouseup", fnLanMoveUp);
        $("html").off("mouseup", fnLanMoveOutUp);
      }
    }
  }



  // イベントの定義


  // window

  // ブラウザをリサイズ
  $(window).resize(function(){
    $('html').scrollTop(0);
    $('html').scrollLeft(0);
    var loadWidth        = $('#ns-main-canvas')[0].getBoundingClientRect().left - 35;
    var loadHeight       = $('#ns-main-canvas')[0].getBoundingClientRect().top - 35;
    var calCanvasWidth   = loadWidth - NS.mainCanvasWidth;
    var calCanvasHeight  = loadHeight - NS.mainCanvasHeight;
    NS.mainCanvasWidth  = loadWidth;
    NS.mainCanvasHeight = loadHeight;
    $("#ns-main img").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#ns-main .bus").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#glayLayer").css({
      'top': $("#ns-container").offset().top,
      'left': $("#ns-container").offset().left,
    });
    // bGlayFlag
    if(NS.bGlayFladg) {
      $("#glayLayer").css({
        'top':   $("#ns-container").offset().top,
        'left':  $("#ns-container").offset().left,
      });
    }
  });

  // GlayLayerの座標の指定 (New)
  $("#glayLayer").css({
    'top': $("#ns-container").offset().top,
    'left': $("#ns-container").offset().left,
    'width':  $("#ns-container").width() - 4,
  });

  //checkLayerの指定
  $("#checkLayer").css({
    'top': $("#ns-main").offset().top,
    'left': $("#ns-main").offset().left,
    'width':  $("#ns-main").width()
  });

  //questionLayerの指定
  $('#questionLayer').css({
    'top': $("#ns-main").offset().top,
    'left': $("#ns-main").offset().left,
    'width':  $("#ns-main").width()
  });

  // //読み込み時のアニメーション
  // $().introtzikas({
  //   line: '#fff', //ラインの色
  //   speedwidth: 1000, //幅の移動完了スピード
  //   speedheight: 1000, //高さの移動完了スピード
  //   bg: '#333' //背景色
  // });




  // ns-nav

  // Dustをクリック
  $("#dust").on('click', fnAllReset);

  //startをクリック
  $("#connect-start").click(function(){

    //変数宣言
    if ( typeof NSFCS === "undefined" ) var NSFCS = {};

      //コンストラクタのようなもの
      function router_const(){
        this.name = "";
        this.ip = [];
        this.sm = [];
        this.routingtable = [];
      }

      function pc_const(){
        this.name = "";
        this.ip = "";
        this.sm = "";
        this.link = "";
      }

    if ($('#ns-main img').hasClass('lanLink')) {

      router = []
      pc = []
      bus = []
      pc_num = 0
      sendData = new Object();

      //busのlanを取得
      if ($('#ns-main-canvas').attr('data-buslan') != undefined) {
        busLan = $('#ns-main-canvas').attr('data-buslan').split(' ');
      }
      else {
        busLan = '';
      }

      for (i=0; i < busLan.length; i++) {
        busLan[i] = busLan[i].slice(2);
      }

      //right-infoから情報回収
      //routerのname, ip, sm, nhaを取得
      $('#ns-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#ns-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          if (j % 3 === 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 === 2){
            router[i].sm[count] = calculation_sm($(e).text());
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }



      //pcのname, ip, smを取得
      $("#ns-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        pc_num++;
      });

      count = 0;
      $("#ns-right dt:contains('PC') + dd .rightInfo-IPSM span").each(function(i, e) {
        if (i % 2 === 0) {
          pc[count].ip = $(e).text();
        }
        else {
          pc[count].sm = calculation_sm($(e).text());
          count += 1;
        }
      });

      //ルーティングテーブルの数だけ生成
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#ns-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //busの情報を取得
      $('#ns-main .bus').each(function (i, e) {
        bus[i] = new Object();
        bus[i].name = $(e).attr('alt');
      });

      //smの計算
      function calculation_sm(sm) {
        if (sm == '' || sm == 'none') {
          return '';
        }
        else {
          tmp = '';
          for(l = 0; l < 4; l++){
            split_sm = '';
            for(m = 0; m < 8; m++){
              if(sm > 0){
                split_sm += '1';
                sm--;
              }
              else{
                split_sm += '0';
              }
            }
            tmp += parseInt(split_sm, 2);
            if (l != 3) {
              tmp += '.';
            }
          }
          return tmp;
        }
      }

      //routerのlink
      for(i=0; i < router.length; i++){
        router[i].link = [];
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < router[i].ip.length; k++){
            router[i].link[k] = [];
            for(l=0; l < dataLanIf.length; l++){
              if (k == dataLanIf[l][2]) {
                if ($(e).hasClass('sP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.eP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.eP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.sP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.sP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのlink
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
              }
            }
            else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
              }
            }
          }
        });
      }

      //pcのroutingtableのlink
      for(i=0; i < pc.length; i++){
        $('#ns-main img[alt="' + pc[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < pc[i].routingtable.length; l++){
              if (pc[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //routerのroutingtableのlink
      for(i=0; i < router.length; i++){
        $('#ns-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < router[i].routingtable.length; l++){
              if (router[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのルーティングテーブルのifが空の場合の処理
      for(i=0; i < pc.length; i++){
        for(j=0; j < pc[i].routingtable.length; j++){
          if (pc[i].routingtable[j].if == '') {
            pc[i].routingtable[j].link = [];
            pc[i].routingtable[j].link[0] = '';
            pc[i].routingtable[j].link[1] = '';
          }
        }
      }

      //routerのルーティングテーブルのifがからの場合の処理
      for(i=0; i < router.length; i++){
        for(j=0; j < router[i].routingtable.length; j++){
          if (router[i].routingtable[j].if == '') {
            router[i].routingtable[j].link = [];
            router[i].routingtable[j].link[0] = '';
            router[i].routingtable[j].link[1] = '';
          }
        }
      }



      //busのリンク
      for(i=0; i < bus.length; i++){
        bus[i].nodes = [];
        count = 0;
        for(j=0; j < busLan.length; j++){
          if ($('#ns-main div[alt=' + bus[i].name + ']').hasClass('sP_' + busLan[j])) {
            bus[i].nodes[count] = $('.eP_' + busLan[j]).attr('alt');
            count++;
          }
          else if ($('#ns-main div[alt=' + bus[i].name + ']').hasClass('eP_' + busLan[j])) {
            bus[i].nodes[count] = $('.sP_' + busLan[j]).attr('alt');
            count++;
          }
        }
      }

      console.log(pc);
      console.log(router);
      console.log(bus);

      sendData.pc_num = pc_num;

      //nodeInfo
      sendData.nodeInfo = [];

      //PCの情報
      for(i=0, j=0; i < pc.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = pc[i].name;
        sendData.nodeInfo[i].ip = pc[i].ip;
        sendData.nodeInfo[i].sm = pc[i].sm
        sendData.nodeInfo[i].link = pc[i].link;
        sendData.nodeInfo[i].routingtable = [];
        for(k=0; k < pc[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = pc[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(pc[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = pc[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = pc[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = pc[j].routingtable[k].link;
        }
      }

      //Routerの情報
      for(i=pc.length, j=0; j < router.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = router[j].name;
        sendData.nodeInfo[i].ip = router[j].ip;
        sendData.nodeInfo[i].sm = router[j].sm;
        sendData.nodeInfo[i].routingtable = [];
        sendData.nodeInfo[i].link = router[j].link;
        for(k=0; k < router[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = router[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(router[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = router[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = router[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = router[j].routingtable[k].link;
        }
      }

      //busの情報
      sendData.busInfo = bus;


      console.log(sendData);

      JsonSendData = JSON.stringify(sendData, null, ' ');
      // JsonSendData = JSON.stringify(sendData);
      console.log(JsonSendData);


      //questionモードのとき
      if ($('.question').length > 0) {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: '/assets/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#ns-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            //正誤をデータベースに送信
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/push_start.php',
              url: '/assets/result.json',
              data: {postData : 1, id : NS.urlparameter, question_id : $('#question span').innerHTML}
            });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/pust_start.php',
              url: '/assets/result.json',
              data: {postData : 0, id : NS.urlparameter, question_id : $('#question span').innerHTML}
            });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }
      else {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: '/assets/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#ns-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#ns-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }

      // $.ajax({
      //   type: 'POST',
      //   dataType: 'text',
      //   // url: 'NewNetworkSimulator/php/post_networkdata.php',
      //   url: '/assets/result.json',
      //   data: {postJsonData : NSFCS.JSONpostData}
      // }).done(function (data) {
      //   resultData = JSON.parse(data);
      //   console.log(resultData);
      //   $("#ns-console").append("<p>>result･･･</p>");
      //
      //   //間違いがない=true, 間違いがある=false
      //   correctFlag = true;
      //
      //   //間違いがあるかないか
      //   for(i=0; i < resultData.length; i++){
      //     if (resultData[i][resultData[i].length-1] == 0) {
      //       correctFlag = false;
      //     }
      //   }
      //
      //   //間違いがない場合
      //   if (correctFlag == true) {
      //     $("#ns-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_circle.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     //正誤をデータベースに送信
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/push_start.php',
      //       url: '/assets/result.json',
      //       data: {postData : 1, id : NS.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //   //間違いがある場合
      //   else {
      //     //circleと同じアニメーション
      //     $("#ns-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NS.questionCanvasY + "px; left: "+ NS.questionCanvasX + "px;" + NS.canvasWidth + "; height:" + NS.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_cross.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/pust_start.php',
      //       url: '/assets/result.json',
      //       data: {postData : 0, id : NS.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //
      //
      //   //resultをコンソールに出力
      //   for(i=0; i < resultData.length; i++){
      //     outputData = '';
      //     classData = '';
      //     for(j=0; j < resultData[i].length-1; j++){
      //       outputData += resultData[i][j];
      //       classData += resultData[i][j];
      //       if (j != resultData[i].length-2) {
      //         outputData += '->';
      //         classData += '-';
      //       }
      //     }
      //     if (resultData[i][j] == '1') {
      //       outputData += '：succses';
      //       classData += '-1';
      //     }
      //     if (resultData[i][j] == '0') {
      //       outputData += '：error';
      //       classData += '-0';
      //     }
      //     $('#ns-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
      //   }
      // }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      //   console.log(errorThrown);
      //   console.log(textStatus);
      //   $("#ns-console").append("<p>> エラーが発生したので処理を終了します。</p>");
      // });

    }
  });


  //Modeをクリック
  $('.mode_draw').click(function () {
    if ($('.change_mode').hasClass('question')) {
      fnchangeMode();
      $('.change_mode').removeClass('question');
      $('.change_mode').addClass('draw');
    }
  });

  $('.mode_question').click(function () {
    if ($('.change_mode').hasClass('draw')) {
      fnchangeMode();
      $('.change_mode').removeClass('draw');
      $('.change_mode').addClass('question');
    }
  });

  //checkをクリック
  $("#check").on(({
    mousedown:function () {

      //onのとき
      if ($('#check').attr('src') == '/assets/check_2.png') {
        //画像をoffに変更
        $('#check').attr('src', '/assets/check.png');
        //checkLayerを閉じる
        $("#checkLayer").css({'display':'none','height':0});
        $("#checkLayer").empty();
      }
      else {
        //画像を変更
        $("#check").attr("src", "/assets/check_2.png");
        //checkLayerを表示
        $("#checkLayer").css({
          display: 'block',
        });
        $("#checkLayer").animate({
          top:    $("#ns-main").offset().top,
          left:   $("#ns-main").offset().left,
          height: $("#ns-main").height(),
          width:  $("#ns-main").width(),
        },{
          duration:400,
          complete:function () {
            $("#checkLayer").append('<canvas width="600" height="400" id="checkLayer-canvas"></canvas>');
            $("#ns-right dd").show();
            $("#ns-right dt img").attr("src", "/assets/minus.jpg");
            NS.IndicateNodeInfo();
          }
        });
      }
    }
    //,

    // mouseup:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // },

    // mouseleave:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // }
  }));


  // Helpをクリック (Update)
  $("#info").click(function(){
    // GlayLayerを表示
    fnGlayOpen();
    // 画像等の追加
    $("#glayLayer").append('<div id="slideGalley"><ul id="slideUl">'+
      '<li><img src="/assets/sample1.png"></li><li><img src="/assets/sample2.png"></li><li><img src="/assets/sample3.png"></li><li><img src="/assets/sample4.png"></li><li><img src="/assets/sample5.png"></li><li><img src="/assets/sample6.png"></li><li><img src="/assets/sample7.png"></li><li><img src="/assets/sample8.png"></li>'+
      '</ul></div>');
    $("#glayLayer").append('<img src="/assets/batu.png" id="glayClose">');
    $("#glayLayer").append('<img src="/assets/left.png" id="infoLeft">');
    $("#glayLayer").append('<img src="/assets/right.png" id="infoRight">');
    // イベントハンドラの追加
    $("#infoLeft").on('click', fnGlayInfoLeft);
    $("#infoRight").on('click', fnGlayInfoRight);
    $("#glayClose").on('click', fnAllGlayClose);
  });

  // Debugをクリック
  $("#cui").click(function(){
    $("#ns-console").append("<p>> デバックしました。</p>");
  });


  //問題ボタンの押した時
  $('.qusetion-select-button').click(function () {
  });


  // ns-left

  // machineryをドラッグ
  $(".machinery").draggable({
    helper: 'clone',  // 要素を複製する
    revert: true,     // ドラッグ終了時に要素に戻る
    zIndex: 3,
    // ドラッグ開始
    start: function(e, ui) { $(this).addClass('dragout'); },
    // ドラッグ終了
    stop: function(e, ui) { $(this).removeClass('dragout'); },
  });

  // lanをクリック
  $("#lan").click(function(){
    NS.changeLanMode();
  });

  //lanボタンをクリック（なぜか反応しない）
  // $('input[name=lanSwitch]').click(function(){
  //   console.log('a');
  //   var elHtml     = $("html");
  //   var elMain     = $("#ns-main");
  //   var elMainDrag = $("#ns-main .ui-draggable");
  //
  //   if ($('input[name=lanSwitch]').hasClass('lanDrawOn')) {
  //     // イベントハンドラーの削除
  //     elMain.off("mousedown", fnLanDown);
  //     elMain.off("mouseup", fnLanUp);
  //     elHtml.off("mouseup", fnLanOutUp);
  //     elMainDrag.off("mouseenter").off("mouseleave");
  //     // カーソルの変更
  //     elMain.css("cursor", "auto");
  //     elMainDrag.css("cursor", "pointer");
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.on("mousedown", fnLanMoveDown);
  //       elMain.on("mouseup", fnLanMoveUp);
  //       elHtml.on("mouseup", fnLanMoveOutUp);
  //     }
  //
  //     $("input[name=busSwitch]").removeClass('lanDrawOn');
  //   }
  //   else {
  //     // イベントハンドラーを付ける
  //     elMain.on("mousedown", fnLanDown);
  //     elMain.on("mouseup", fnLanUp);
  //     elHtml.on("mouseup", fnLanOutUp);
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.off("mousedown", fnLanMoveDown);
  //       elMain.off("mouseup", fnLanMoveUp);
  //       elHtml.off("mouseup", fnLanMoveOutUp);
  //     }
  //     // カーソルの変更
  //     elMain.css("cursor", "crosshair");
  //     elMainDrag.css("cursor", "crosshair");
  //     // 画像のドラッグ防止
  //     elMainDrag.mouseup(function(e) { e.preventDefault(); });
  //     elMainDrag.mousedown(function(e) { e.preventDefault(); });
  //     // 画像にマウスが乗った時の動作
  //     elMainDrag.mouseenter(function(){
  //       // フラグの設定
  //       NS.lanFlag = true;
  //       $(this).addClass("lanOn");
  //       $(this).draggable("disable");
  //     }).mouseleave(function(){
  //       // フラグの設定
  //       NS.lanFlag = false;
  //       $(this).removeClass("lanOn");
  //       $(this).draggable("enable");
  //     });
  //     $("input[name=lanSwitch]").addClass('lanDrawOn');
  //   }
  // });

  // LANのスター型とバス型をクリック
  $('input[name=busSwitch]').click(function(){

    //fnAllReset();
    // NS.lanArrClass = $("#ns-main-canvas").attr("class").split(/\s?L_/);
    // NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
    // for(var i = 1; i < NS.lanArrClass.length; i++) {
    //   fnLanDraw();
    //   //fnIfDraw(NS.lanArrClass[i]);
    // }

    //バスをoffにする
    if ($('input[name=busSwitch]').hasClass('busOn')) {
      $("#ns-main").off("mousedown", fnBusDown);
      $("#ns-main").off("mouseup", fnBusUp);
      $("html").off("mouseup", fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    //バスをonにする
    else {
      // イベントハンドラーを付ける
      $("#ns-main").on("mousedown", fnBusDown);
      $("input[name=busSwitch]").addClass('busOn');

      //lanがonの時offに切り替え
      if ($('#lan').attr('src') == '/assets/lanCable_2.png') {
        NS.changeLanMode();
      }
    }
  });



  // ns-main

  // ns-mainにドロップ
  $("#ns-main").droppable({
    accept: '.machinery',
    tolerance: 'fit',
    // ドロップされたとき
    drop: function(e, ui){
      fnMainDrop(ui, $(this));
      NS.mainDropFlg = false;
    },
    // ドロップを受け入れる Draggable 要素がドラッグを終了したとき
    deactivate: function(e, ui){
      ui.draggable.draggable({ revert: NS.mainDropFlg });
      if(NS.mainDropFlg === false) {
        NS.mainDropFlg = true;
      }
    }
  });

  // ns-mainの画像の上にいるとき
  $("#ns-main").on("mouseover", "img", function(e){

    $(e.target).addClass('mouseover');

    $("#ns-right dt:contains('"+ $(this).attr("alt") +"'), #ns-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "#49cbf6",
    });
  }).on("mouseout", "img", function(e){
    $("#ns-right dt:contains('"+ $(this).attr("alt") +"'), #ns-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "",
    });
  });

  //busの上にある時
  $("#ns-main").on("mouseover", ".bus", function(e){
    //if ($('#lan').attr('src') === '/assets/lanCable.png') {
      $(e.target).addClass('bus-mouseover');
      $(e.target).draggable();
    //}
  });

  ////ns-mainの画像の上から外れた時
  $("#ns-main").on("mouseout", "img", function(e){

    $(e.target).removeClass('mouseover');

  });

  //ns-mainのバスの上から外れた時
  $("#ns-main").on("mouseout", ".bus", function(e){

    $(e.target).removeClass('bus-mouseover');

  });

  //バスのドラック後
  $("#ns-main").on("mouseup", ".bus", function(e){
    fnLanDraw();
  });


  //animecanvasを削除
  $('body').click(function () {
    $('.animecanvasflag').remove();
  });

  //描画中にns-main-canvasの外に出た時描画を中止する
  $('html').on('mouseover', function (e) {
    console.log('mouseover html: ');
    if ($(e.target).attr('id') != 'ns-main-canvas' && NS.busDrawFrag == true && $(e.target).hasClass('ui-draggable') == false) {
      NS.points = [];
      NS.addCanvas.remove();
      NS.busDrawFrag = false;
      // イベントハンドラの削除
      $('#ns-main').off('mousemove', fnBusDrag);
      $('#ns-main').off('mouseup', fnbusUp);
    }
    if ($(e.target).attr('id') != 'ns-main-canvas') {
      //console.log('ns-main-canvas外');
    }
    if (NS.lanFlagPoint === true) {
      console.log('lanPointがtrue');
    }

    if ($(e.target).attr('id') != 'ns-main-canvas' && NS.lanFlagPoint == true && $(e.target).hasClass('ui-draggable') == false) {
      console.log('消したるで');
      NS.addCanvas.remove();
      if(!(NS.lanFlaglink)) {
        $(".sP_"+ NS.lanNode).removeClass("lanLink");
      }
      $("#ns-main").off("mousemove", fnLanDrag);
      $("#ns-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NS.lanNode).removeClass("sP_"+ NS.lanNode);
      $("#ns-main-canvas").removeClass("L_"+ NS.lanNode);
      // 変数とフラグをリセット
      NS.points = [];
      NS.lanFlaglink = false;
      NS.lanFlagPoint = false;
    }
  });

  //マウスを動かしたら再描画
  $('#ns-main').on('mousemove', function (e) {
    if ($('#ns-main-canvas').attr('class') == '' && $('#ns-main img').length > 0) {
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      fnNameDraw();
    }
  });

  //infoに乗った時indexを上げる
  $('.info').on(({
    mouseover:function () {
      console.log(e);
    }
  }));

  //busからmouseを離す
  $('.bus').on('click', function (e) {
    console.log('a');
  });

  $('.bus').mouseout(function () {
    console.log('1');
  })



  // ns-right

  // ns-rightのimgをクリック
  $("#ns-right").on("click", "img", function(){
    var elthis = $(this);
    if(elthis.attr("src") === "/assets/plus.jpg") {
      elthis.attr("src", "/assets/minus.jpg");
      elthis.parent("dt").next().show();
    }
    else if(elthis.attr("src") === "/assets/minus.jpg") {
      elthis.attr("src", "/assets/plus.jpg");
      elthis.parent("dt").next().hide();
    }
  });

  // ns-right-infoのimgをクリック
  $("#ns-right-info img").on("click", function(){
    if($(this).attr("src") === "/assets/open.png") {
      $("#ns-right dd").show();
      $("#ns-right dt img").attr("src", "/assets/minus.jpg");
    }
    if($(this).attr("src") === "/assets/close.png") {
      $("#ns-right dd").hide();
      $("#ns-right dt img").attr("src", "/assets/plus.jpg");
    }
  });


  //行動を保存する
  $('html').on('click', function (e) {

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/vendor/json/sample1.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{id : NS.urlparameter, timeStamp: e.timeStamp, outerHTML: e.target.outerHTML}
    });
  });

});
