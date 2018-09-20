function createContextMenu()
{
  $.contextMenu( 'destroy' );
  $.contextMenu({
    selector:"#contextMenuArea"
    ,items: $.contextMenu.fromMenu($("#contextMenuTemplate"))
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
<<<<<<< HEAD
<<<<<<< HEAD

  $("#div1").draggable();

=======
  
>>>>>>> f62839404bbc30684479f33ea542ba2d562b4066
});

=======
>>>>>>> 1fb7c9d1132e1742423da98b5acd5f3eb20dde5a

  //$("#div1").draggable();

});
