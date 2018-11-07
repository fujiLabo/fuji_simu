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
      NS.mainDropFlg = false;
      fnMainDrop(ui, $(this));
    },
    deactivate: function(e, ui) {
      ui.draggable.draggable({
        revert: NS.mainDropFlg
      });
      if (NS.mainDropFlg == false) {
        NS.mainDropFlg = true;
      }
    }
  });

  //LANボタンを押した際
  $('#lan').click(function(){
    changeLanMode();
    console.log("LAN押された");
  });

  //右側の詳細部分の画像をクリックした際
  $('#ns_rightInfo img').click( function(){
    if ($(this).attr("id") === "r-close"){
      console.log("-押された");
    }else{
      console.log("+押された");
    }
  });



});
