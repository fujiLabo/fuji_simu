//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  $('.page p').text("JQuery可動テスト(稼働中)");


  $('.PC').bind('contextmenu' , function(){
    $(this).fadeOut();
    return false;
  })

  $('.router').bind('contextmenu' , function(){
    $(this).fadeOut();
    return false;
  })

  //$("#div1").draggable();

});
