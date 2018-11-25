//mainファイル
//直接htmlを操作する

//他のファイルが読み込まれてからこのファイルを読み込む
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){

  console.log("呼ばれた?");

  //テスト
  $('#ns_main img').mouseover(function(){
    console.log("testflag = true");
    NS.testflag = true;
  }).mouseout(function(){
    console.log("testflag = false");
    NS.testflag = false;
  });

  //PCやルータのドラッグ設定
  $('.machine').draggable({
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

  $('#ns_main').droppable({
    accept: '.machine',
    tolerance: 'fit',

    drop: function(e, ui) {
      NS.mainDropFlag = false;
      fnMainDrop(ui, $(this));
    },
    deactivate: function(e, ui) {
      ui.draggable.draggable({
        revert: NS.mainDropFlag
      });
      if (NS.mainDropFlag == false) {
        NS.mainDropFlag = true;
      }
    }
  });

  //マウスを動かしている間再描画
  $('#ns_main').mousemove(function(e) {
    if ($('#ns_main_canvas').attr('class') === '' && $('#ns_main img').length > 0){
      //NS.mainCtx.clearRect(0, 0, NS.canvasWidth, NS.canvasHeight);

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
