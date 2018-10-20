mainDropFlg = true;

var test = 1;

//独自の右クリック作成
function fncontextmenu(element) {
  console.log(element);

  //document.oncontextmenu = function () {
  //   return false;
  //};

  $.contextMenu('destroy');

  $('#contextMenuTemplate').html('');

  $('#contextMenuTemplate').append('<form action = "#"/>');

  $('#contextMenuTemplate form').append('<table class = "context_IPSMIF" width = "200"> <tr align = "center"> </tr> </table>');

  $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IF">IF</label></th>');

  $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IP">IPアドレス</label></th>');

  $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="SM">SM</label></th>');


  $('#contextMenuTemplate').append(
    $('<input>').attr({
      name: "入力",
      type: "text",
      size: "16",
    })
  );

  $('#contextMenuTemplate').append(
    $('<menuitem>').attr({
      label: "削除",
    })
  );

  $('#contextMenuTemplate').append(
    $('<menuitem>').attr({
      label: "閉じる",
    })
  );




  $.contextMenu({
    selector: ".dropMachine",
    items: $.contextMenu.fromMenu($('#contextMenuTemplate'))
  });
}


//この書き方ならリロード時もjqueryを読み込む
$(function() {



  $(document).on('contextmenu', '.dropMachine', function() {
    //fncontextmenu(this);

  });


  //PCやルータのドラッグ設定
  $('.machine').draggable({
    helper: 'clone',
    revert: true,
    zIndex: 3,

    start: function(e, ui) {
      $(this).addClass('dragout')
    },
    stop: function(e, ui) {
      $(this).removeClass('dragout')
    },
  });

  $('#ns_main').droppable({
    accept: '.machine',
    tolerance: 'fit',

    drop: function(e, ui) {
      mainDropFlg = false;
      fnMainDrop(ui, $(this));
    },
    deactivate: function(e, ui) {
      ui.draggable.draggable({
        revert: mainDropFlg
      });
      if (mainDropFlg == false) {
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
  fnMainDrop = function(ui, obj) {
    $('#ns_main').append(
      $('<img>').attr({
        src: ui.draggable.attr('src'),
        class: 'dropMachine',
        id: "test",
        style: "position: absolute; top: " + ui.offset.top + "px; left: " + ui.offset.left + "px",


      })
    );
    //先代はこのコードで属性を与え、関数を呼ぼ出している
    $("#ns_main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');

    //mainにドロップされたものをドラッグ可能に(オプションによってmain内でのみに移動を限定する必要あり)
    $('#ns_main img:last-child').draggable({});
  }



});
