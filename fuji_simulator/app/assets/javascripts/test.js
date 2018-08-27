
//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  $('.page p').text("JQuery可動テスト(稼働中)");


  $('.PC').bind('contextmenu' , function(){
    $(this).fadeOut();

  })

  $('.router').bind('contextmenu' , function(){
    $(this).fadeOut();
  })

  //$("#div1").draggable();

});





//$(function(){
//  $('p').css('color','orenge');
//});
