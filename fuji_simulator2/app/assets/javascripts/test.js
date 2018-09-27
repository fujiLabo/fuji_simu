//この書き方ならリロード時もjqueryを読み込む
$(document).on('turbolinks:load', function(){
  $('#text').text('jquery実装');

  $('.PC').draggable();

});
