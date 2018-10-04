
mainDropFlg = true;

//この書き方ならリロード時もjqueryを読み込む
$(document).on('turbolinks:load', function(){
  $('#text').text('jquery実装');

  $('.PC').draggable();


  //PCやルータのドラッグ設定
  $('.machine').draggable({
    helper: 'clone',
    revert: true,
    zIndex: 3,

    start: function(e, ui){$(this).addClass('dragout')},
    stop: function(e, ui){$(this).removeClass('dragout')},
  });

  $('#ns_main').droppable({
    accept: '.machine',
    tolerance: 'fit',

    drop: function(e, ui){
      mainDropFlg = false;
    },
    deactivate: function(e, ui){
      ui.draggable.draggable({ revert: mainDropFlg});
      if (mainDropFlg == false){
        mainDropFlg = true;
      }
    }
  });
  /*
  //読み込み時のアニメーション ()
  $().introtzikas({
    line: '#fff', //ラインの色
    speedwidth: 1000, //幅の移動完了スピード
    speedheight: 1000, //高さの移動完了スピード
    bg: '#333' //背景色
  });
  */




});
