function createContextMenu()
{
  $.contextMenu( 'destroy' );
  $.contextMenu({
    selector:"#contextMenuArea"
    items: $.contextMenu.fromMenu($("#contextMenuTemplate"))
  });
}




//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  //createContextMenu();

$('.PC').animateClick();

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
