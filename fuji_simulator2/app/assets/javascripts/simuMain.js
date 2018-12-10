//mainファイル
//直接htmlを操作する

//他のファイルが読み込まれてからこのファイルを読み込む
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){

  // //読み込み時のアニメーション
  // $().introtzikas({
  //   line: '#fff', //ラインの色
  //   speedwidth: 1000, //幅の移動完了スピード
  //   speedheight: 1000, //高さの移動完了スピード
  //   bg: '#333' //背景色
  // });

  //初期位置に戻す
  $('html').scrollTop(0);
  $('html').scrollLeft(0);

  //テスト
  $('#ns_main img').mouseover(function(){
    console.log("testflag = true");
    NS.testflag = true;
  }).mouseout(function(){
    console.log("testflag = false");
    NS.testflag = false;
  });

  //PCやルータのドラッグ設定
  $('.dropImage').draggable({
    helper: 'clone',
    revert: true,
    zIndex: 3,

    start: function(e, ui) {
      $(this).addClass('dragout')
    },
    stop: function(e, ui) {
      $(this).removeClass('dragout')
    },
  });

  //ns_mainにドロップ
  $('#ns_main').droppable({
    accept: '.dropImage',
    tolerance: 'fit',

    //ドロップされたとき
    drop: function(e, ui) {
      NS.mainDropFlag = false;
      fnMainDrop(ui, $(this));
    },
    //ドロップを受け入れる Draggable 要素がドラッグを終了したとき
    deactivate: function(e, ui) {
      ui.draggable.draggable({
        revert: NS.mainDropFlag
      });
      if (NS.mainDropFlag == false) {
        NS.mainDropFlag = true;
      }
    }
  });

  //busからmouseを放す
  $('.bus').on('click', function(e) {
    console.log('busクリック');
  });

  $('.bus').mouseout(function () {
    console.log('busから離れた');
  });

  // $('#ns_main').droppable({
  //   accept: '#Bus',
  //   tolerance: 'fit',
  //
  //     //ドロップされたとき
  //     drop: function(e, ui) {
  //       fnBusDrop();
  //     },
  //     //ドロップを受け入れる Draggable 要素がドラッグを終了したとき
  //     deactivate: function(e, ui) {
  //       ui.draggable.draggable({
  //
  //       });
  //       // if (NS.mainDropFlag == false) {
  //       //   NS.mainDropFlag = true;
  //       // }
  //     }
  //   });


  //ns_mainの画像の上にいるとき
  $('#ns_main').on('mouseover', 'img', function(e) {

    $(e.target).addClass('mouseover');

    $("#ns_right dt:contains('" + $(this).attr("alt") + "'), #ns_right dt:contains('" + $(this).attr("alt") + "') + dd").css({
      color: "#49cbf6",
    });
  }).on("mouseout", "img", function(e) {
    $("#ns_right dt:contains('"+ $(this).attr("alt") +"'), #ns_right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "",
    });
  });

  //busの上にあるとき
  $('#ns_main').on('mouseover', '.bus', function(e) {
    $(e.target).addClass('bus_mouseover');
    $(e.target).draggable();
  });

  //ns_mainの画像の上から外れたとき
  $("#ns_main").on("mouseout", "img", function(e) {
    $(e.target).removeClass('mouseover');
  });

  //ns_mainのbusの上から外れたとき
  $('#ns_main').on('mouseout', '.bus', function(e) {
    $(e.target).removeClass('bus_mouseover');
  });

  //busのドラッグ後
  $('#ns_main').on('mouseup', '.bus', function(e) {
    fnLanMainDraw();
  });

  //animecanvasを削除
  $('body').click(function () {
    $('.animecanvasflag').remove();
  });

  //マウスを動かしている間再描画
  $('#ns_main').mousemove(function(e) {
    if ($('#ns_main_canvas').attr('class') === '' && $('#ns_main img').length > 0){
      NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);
      fnNameDraw();

    }
  });

  //LANボタンを押した際
  $('#lan').click(function(){
    fnChangeLanMode();
  });

  //右側の中身の画像をクリックした際
  $('#ns_right').on('click', 'img', function(){
    console.log("右側やで");
    var elthis = $(this);
    //詳細部分の表示
    if (elthis.attr('src') === '/assets/plus.jpg') {
      elthis.attr('src', '/assets/minus.jpg');
      elthis.parent('dt').next().show();
      //詳細部分の非表示
    }else if (elthis.attr('src') === '/assets/minus.jpg') {
      elthis.attr('src', '/assets/plus.jpg');
      elthis.parent('dt').next().hide();
    }
  });

  //右側のトポロジーの概要部分の画像をクリックした際
  $('#ns_rightInfo img').click(function(){
    //すべての詳細を非表示
    if ($(this).attr("id") === "r-close"){
      $('#ns_right dd').hide();
      $('#ns_right dt img').attr('src', '/assets/plus.jpg');
    }else{
      //すべての詳細を表示
      $('#ns_right dd').show();
      $('#ns_right dt img').attr('src', '/assets/minus.jpg');
    }
  });

  //モードをdrawに変更
  $('.mode_draw').click(function () {
    if ($('.change_mode').hasClass('question')) {
      console.log('モードをdrawに変更');
      fnChangeMode();
      $('#questionTip').css('display', 'none');
      $('.change_mode').removeClass('question');
      $('.change_mode').addClass('draw');
    }
  });
  //モードをquestionに変更
  $('.mode_question').click(function () {
    if ($('.change_mode').hasClass('draw')) {
      console.log('モードをquestionに変更');
      fnChangeMode();
      $('#questionTip').css('display', 'block');
      $('.change_mode').removeClass('draw');
      $('.change_mode').addClass('question');
    }
  });

  //それぞれのツールのクリック処理
  $('#start').click(function() {
    console.log("start");
  });

  $('#check').click(function() {
    console.log('目ん玉〜');
    //onのとき
    if ($('#check').attr('src') == '/assets/check_2.png') {
      //画像をoffに変更
      $('#check').attr('src', '/assets/check.png');
      //checkLayerを閉じる
      $('#checkLayer').css({'display': 'none', 'height' : 0});
      $('#checkLayer').empty();
    }else {
      //画像を変更
      $('#check').attr('src', '/assets/check_2.png');
      //checkLayerを表示
      $('#checkLayer').css({
        display: 'block',
      });
      $('#checkLayer').animate({
        top:    $('#ns_main').offset().top,
        left:   $('#ns_main').offset().left,
        height: $('#ns_main').height(),
        width:  $('#ns_main').width(),
      },{
        duration: 400,
        complete: function() {
        $('#checkLayer').append('<canvas width = "600" height = "400" id = "checkLayer_"canvas"></canvas>');
        $('#nsright dd').show();
        $('#ns_right dt img').attr('src', '/assets/minus.jpg');
        IndicateNodeInfo();
      }
    });
    }

  });

  $('#dust').click(function() {
    fnAllReset();
  });

  $('#study').click(function() {

  });

  $('#save').click(function() {

  });

  $('#load').click(function() {

  });

  $('#quit').click(function() {
    console.log("quit");

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: '/assets/quit.json',
      //data: {id : urlparameter}
    }).done(function(Qdata) {
      console.log(Qdata);
    })
  })

  // //描画中にns_main_canvasの外に出たとき描画を中止する
  // $('html').on('mouseover', function(e) {
  //   console.log('mouseover html (e): ' + $(e).attr('class'));
  //   if ($(e.target).attr('id') != 'ns_main_canvas' && NS.busDrawFrag == true && $(e.target).hasClass('ui-draggable') == false) {
  //     NS.points = [];
  //     NS.addCanvas.remove();
  //     NS.busDrawFrag = false;
  //     //イベントハンドラの削除
  //     //$('#ns_main').off('mousemove', fnBusDrag);
  //     //$('#ns_main').off('mouseup', fnBusUp);
  //   }
  //
  //   if ($(e.target).attr('id') != 'ns_main_canvas') {
  //     console.log('ns_main_canvas外');
  //   }
  //   if (NS.lanPointFlag === true){
  //     console.log('lanPointがtrue');
  //   }
  //
  //   //要修正
  //   if ($(e.target).attr('id') != 'ns_main_canvas' && NS.lanPointFlag == true && $(e.target).hasClass('dropMachine') == true){
  //     console.log('消したるで');
  //     NS.addCanvas.remove();
  //     if (!(NS.lanLinkFlag)) {
  //       $('.sP_' + NS.lanNode).removeClass('lanLink');
  //     }
  //     $('#ns_main').off('mousemove', fnLanOnDrag);
  //     $('#ns_main .ui-draggable').removeClass('lanFirst');
  //     $('.sP_' + NS.lanNode).removeClass('sP_' + NS.lanNode);
  //     $('#ns_main_canvas').removeClass('L_' + NS.lanNode);
  //     //変数とフラグのリセット
  //     NS.points = [];
  //     NS.lanLinkFlag = false;
  //     NS.lanPointFlag = false;
  //   }
  // });

  //ブラウザをリサイズ(ブラウザのサイズを変更した際に呼び出される)
  $(window).resize(function(){
    console.log("リサイズされました");
    $('html').scrollTop(0);
    $('html').scrollLeft(0);
    var loadWidth         = $('#ns_main_canvas')[0].getBoundingClientRect().left -35;
    var loadHeight        = $('#ns_main_canvas')[0].getBoundingClientRect().top -35;
    var calCanvasWidth    = loadWidth - NS.mainCanvasWidth;
    var calCanvasHeight   = loadHeight - NS.mainCanvasHeight;
    NS.mainCanvasWidth    = loadWidth;
    NS.mainCanvasHeight   = loadHeight;
    $('#ns_main img').each(function(i, val){
      $(val).offset({
        left: $(val).offset().left += calCanvasWidth,
        top: $(val).offset().top += calCanvasHeight,
      });
    });
    $('#glayLayer').css({
      'top':  $('#ns_container').offset().top,
      'left': $('#ns_container').offset().left,
    });

    //bGlayFlag
    if (NS.bGlayFladg) {
      $('#glayLayer').css({
        'top': $('#ns_container').offset().top,
        'left': $('#ns_container').offset().left,
      })
    }
  });

  //行動を保存する(らしい)
  $('html').on('click', function(e) {
    console.log("保存しとる");
  });



});
