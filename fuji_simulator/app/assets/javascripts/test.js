
//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  $('p').text("JQuery可動テスト(稼働中)");


$('.PC').contextMenu('testMenu1',
{
  bindings: {
    "open":function(t){
      alert('Trigger was '+t.id+'/nAction was Open');
    }
  }

  /*$('#btn').animateClick({
    "color": "blue",
    "animation": "cross",
    "size": 12
  });
  */


  $('.PC').bind('contextmenu' , function(){

    $(this).fadeOut();
    return false;
  })

  $('.router').bind('contextmenu' , function(){
    $(this).fadeOut();
    return false;
  })


});





//$(function(){
//  $('p').css('color','orenge');
//});
