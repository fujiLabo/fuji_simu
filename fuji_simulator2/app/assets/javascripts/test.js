
mainDropFlg = true;

var test = 1;
//この書き方ならリロード時もjqueryを読み込む
$(document).on('turbolinks:load', function(){

  function fncontextmenu(element)
  {
    console.log("test");

    document.oncontextmenu = function () {
       return false;
    };

    $.contextMenu( 'destroy' );
  }

  $(document).on('contextmenu', '.dropMachine', function(){
    fncontextmenu(this);

  });


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
      fnMainDrop(ui, $(this));
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

//画像をmain部分にドロップする際の関数
fnMainDrop = function(ui, obj)
{
  $('#ns_main').append(
    $('<img>').attr({
      src: ui.draggable.attr('src'),
      class: 'dropMachine',
      id: "test",
      style: "position: absolute; top: "+ ui.offset.top + "px; left: "+ ui.offset.left +"px",

    })

  );
  //先代はこのコード属性を与え、関数を呼ぼ出している
  //$("#ns_main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');

  //mainにドロップされたものをドラッグ可能に(オプションによってmain内でのみに移動を限定する必要あり)
  $('#ns_main img:last-child').draggable({
  });
}



});
