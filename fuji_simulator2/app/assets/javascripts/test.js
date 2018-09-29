//この書き方ならリロード時もjqueryを読み込む
$(document).on('turbolinks:load', function(){
  $('#text').text('jquery実装');

  $('.PC').draggable();


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
