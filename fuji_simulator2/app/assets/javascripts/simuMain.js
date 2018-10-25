//mainファイル
//直接htmlを操作する


$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){
  console.log("test");
  //console.log(don);
  console.log("NS.canvasHeight(main): " + NS.canvasHeight)
  //NS.mainCtx      = $('#ns_main_canvas')[0].getContext('2d');
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

  $('#lan').click(function(){
    changeLanMode();
    console.log("LAN押された");
  });


});
