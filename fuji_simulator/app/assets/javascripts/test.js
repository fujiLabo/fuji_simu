
//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  $('p').text("JQuery可動テスト(稼働中)");


  $('.PC').dblclick(function(){
    $(this).fadeOut();

  })
});

$(function(){
  $('p').css('color','orenge');
});
