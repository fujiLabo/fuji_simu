//mainファイル
//直接htmlを操作する


//他のファイルが読み込まれてからこのファイルを読み込む
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){


  $('#ns_main img').mouseover(function(){
    console.log("testflag = true");
    NS.testflag = true;
  }).mouseout(function(){
    console.log("testflag = false");
    NS.testflag = false;
  });


  console.log("NS.canvasHeight(main): " + NS.canvasHeight)
  console.log("test: " + NS.mainCtx);

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

  //LANボタンを押した際
  $('#lan').click(function(){
    changeLanMode();
  });

  //右側の中身の画像をクリックした際
  $('ns_right img').click(function(){
    console.log("右側やで");
  });

  //右側のトポロジーの概要部分の画像をクリックした際
  $('#ns_rightInfo img').click(function(){
    if ($(this).attr("id") === "r-close"){
      console.log("-押された");
    }else{
      console.log("+押された");
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

  });

  $('#study').click(function() {

  });

  $('#save').click(function() {

  });

  $('#load').click(function() {

  });

  $('#quit').click(function() {
    console.log("quit");
  })




});
