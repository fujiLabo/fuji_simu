//simuMainで使われる関数のファイル

//右クリック時に実行
fncontextmenu = function(element) {
  if (true) {
    var count = 0;
    var split_lan = [];

    var lan_info = $(element).attr('data-ifnum');


    //console.log(element);
    var nodeName = $("img[alt='" + $(element)[0].alt +  "']")[0].alt;

    $.contextMenu( 'destroy' );

    //contextMenuを生成
    $('#contextMenuTemplate').html('');

    $('#contextMenuTemplate').append('<form action="#"/>');

    $('#contextMenuTemplate form').append('<table class="context-IPSMIF" width="200"><tr align="center"></tr></table>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IF">IF</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="IP">IPアドレス</label></th>');

    $('#contextMenuTemplate form .context-IPSMIF tr').append('<th><label class="SM">SM</label></th>');

    //自由描画モード
    if ($(element).hasClass('context-menu-Router')) {
      var selectorType = '.context-menu-Router';

      //ifの数だけIPアドレスとSM入力欄を生成
      for(i = 0; i < $(element).attr('data-ifnum'); i++){
        num = $('#ns-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
        //$('#ns-right:contains').attr
        createIP_SM(nodeName.slice(6), num, 'Router');
      }

      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<img src="/assets/plus.jpg" class="' + nodeName + '" onClick="return addRoutingTable(this)">');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      for (i = 0; i <= $(element).attr('data-routingtablenum'); i++) {
        createRoutingTable(nodeName.slice(6), i);
      }

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '削除',
          class: nodeName,
          onclick: 'return nodeDel(this);'
        }));

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));

      }

    else if ($(element).hasClass('context-menu-PC')) {
      var selectorType = '.context-menu-PC';

      //IPアドレスとSM入力欄を生成
      createIP_SM(nodeName.slice(2), 0, 'PC');


      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-IP' + nodeName.slice(2) + '_' + 0 + '"  type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-IP' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
      '<input id="PCroutingtable-SM' + nodeName.slice(2) + '_' + 0 +'" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-SM' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0 + '" type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td>if<input id="PCroutingtable-IF' + nodeName.slice(2) + '_' + 0 + '" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-IF' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');


      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '削除',
          class: nodeName,
          onclick: 'return nodeDel(this);'
        }));

      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));
    }

    //問題演習モードの場合
    else if ($(element).hasClass('q-context-menu-Router')) {
      var selectorType = '.q-context-menu-Router';

      //ifの数だけIPアドレスとSM入力欄を生成
      for(i = 0; i < $(element).attr('data-ifnum'); i++){
        num = $('#ns-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
        //$('#ns-right:contains').attr
        createIP_SM(nodeName.slice(6), num, 'Router');
      }

      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<img src="/assets/plus.jpg" class="' + nodeName + '" onClick="return addRoutingTable(this)">');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      for (i = 0; i <= $(element).attr('data-routingtablenum'); i++) {
        createRoutingTable(nodeName.slice(6), i);
      }

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');


      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));


    }

    else if ($(element).hasClass('q-context-menu-PC')) {
      var selectorType = '.q-context-menu-PC';

      //IPアドレスとSM入力欄を生成
      createIP_SM(nodeName.slice(2), 0, 'PC');


      $('#contextMenuTemplate form').append('<li class="context-menu-separator"></li>');

      $('#contextMenuTemplate form .context-menu-separator').after('<table class="context-RoutingTable" width="300"><tr align="center"></tr></table>');

      //ルーティングテーブル作成
      $('#contextMenuTemplate form .context-RoutingTable tr').append('<th><label>RoutingTable</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>')
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IPSM">宛先ルート</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-NHA">NHA</label></th>');
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').append('<th><label class="routingtable-IF">IF</label></th>');

      //ifの数だけ生成
      $('#contextMenuTemplate form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-IP' + nodeName.slice(2) + '_' + 0 + '"  type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-IP' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
      '<input id="PCroutingtable-SM' + nodeName.slice(2) + '_' + 0 +'" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-SM' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td><input id="PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0 + '" type="text" size="13" value="' + document.getElementById('rightInfo-PCroutingtable-NHA' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
      $('#contextMenuTemplate .context-RoutingTable tr:last-child')
      .append('<td>if<input id="PCroutingtable-IF' + nodeName.slice(2) + '_' + 0 + '" type="text" size="1" value="' + document.getElementById('rightInfo-PCroutingtable-IF' + nodeName.slice(2) + '_' + 0).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

      $('#contextMenuTemplate').append('<li class="context-menu-separator"></li>');



      $('#contextMenuTemplate').append(
        $('<menuitem>').attr({
          label: '閉じる'
        }));
    }


    $.contextMenu({
      selector: selectorType,
      items: $.contextMenu.fromMenu($('#contextMenuTemplate'))
    });

  }
}

//contextMenuの動作

//ns-rightに値を入れる
fCopy = function(e){
  id = 'rightInfo-' + e.id;
  $('#' + id).text(e.value);
}

//IPアドレスとSM入力欄を作成
createIP_SM = function(nodeNum, ifNum, kind) {

 if (kind === 'Router') {

   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').after('<tr align="center"></tr>');

   //IF
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append('<td>if' + ifNum + '：</td>');

   //IPアドレス入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<td/>').append(
     $('<input/>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum + '_' + ifNum).innerHTML,
       id: 'IP' + nodeNum + '_' + ifNum,
       class: 'context-IP IPSMIF-item-middle',
       onKeyUp: 'return fCopy(this);'
     })));

   //SM入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<td/>').append(
     $('<input/>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum + '_' + ifNum).innerHTML,
       id: 'SM' + nodeNum + '_' + ifNum,
       class: 'context-SM',
       onKeyUp: 'return fCopy(this);'
     })));
   /*
   //SM入力欄
   $('#contextMenuTemplate form').append('<li class="context-SM"></li>');
   $('#contextMenuTemplate form .context-SM:last-child').append('<label></label>');
   $('#contextMenuTemplate form .context-SM:last-child label').append(
     $('<input>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum + '_' + lanNum).innerHTML,
       id: 'context-rightInfo-SM' + nodeNum + '_' + lanNum,
       class: 'context-SM',
       onKeyUp: 'return fCopy(this);'
     }));


   //IPアドレス入力欄
   $('#contextMenuTemplate form').append('<li class="context-IP"></li>');
   $('#contextMenuTemplate form .context-IP:last-child').append('<label></label>');
   $('#contextMenuTemplate form .context-IP:last-child label').append(
     $('<input>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum + '_' + lanNum).innerHTML,
       id: 'context-rightInfo-IP' + nodeNum + '_' + lanNum,
       class: 'context-IP',
       onKeyUp: 'return fCopy(this);'
     }));
     */
 }

 else if (kind === 'PC') {

   $('#contextMenuTemplate form .context-IPSMIF tr').after('<tr align="center"></tr>');

   //IF
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append('if0：'));

   //IPアドレス入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append(
     $('<input>').attr({
       name: 'IPアドレス',
       type: 'text',
       size: '16',
       value: document.getElementById('rightInfo-IP' + nodeNum).innerHTML,
       id: 'IP' + nodeNum,
       class: 'context-IP IPSMIF-item-middle',
       onKeyUp: 'return fCopy(this);'
     })));

   //SM入力欄
   $('#contextMenuTemplate form .context-IPSMIF tr:last-child').append($('<th/>').append(
     $('<input>').attr({
       name: 'SM',
       type: 'text',
       size: '2',
       value: document.getElementById('rightInfo-SM' + nodeNum).innerHTML,
       id: 'SM' + nodeNum,
       class: 'context-SM IPSMIF-item',
       onKeyUp: 'return fCopy(this);'
     })));

 }
}

//Routingtable入力欄を作成
createRoutingTable = function(nodeNum, iNum) {
  //iNum += 1;
  $('#contextMenuTemplate .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');

  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-IP' + nodeNum + '_' + iNum + '"  type="text" size="13" value="' + document.getElementById('rightInfo-routingtable-IP' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/>/' +
  '<input id="routingtable-SM' + nodeNum + '_' + iNum +'" type="text" size="1" value="' + document.getElementById('rightInfo-routingtable-SM' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/>→</td>');
  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-NHA' + nodeNum + '_' + iNum + '" type="text" size="13" value="' + document.getElementById('rightInfo-routingtable-NHA' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"/></td>');
  $('#contextMenuTemplate .context-RoutingTable tr:last-child')
  .append('<td>if<input id="routingtable-IF' + nodeNum + '_' + iNum + '" type="text" size="1" value="' + document.getElementById('rightInfo-routingtable-IF' + nodeNum + '_' + iNum).innerHTML + '" onKeyUp="return fCopy(this);"></td>');

  if (iNum != 0) {
    $('#contextMenuTemplate .context-RoutingTable tr:last-child')
    .append('<img src="/assets/minus.jpg" id="minus' + nodeNum + '_' + iNum + '" class="Router' + nodeNum + '" onClick="return delRoutingTable(this)">');
  }


  // if ($('#context-rightInfo-IF-NHA' + nodeNum + '_' + iNum)[0].value == 'DirectConected') {
  //   e = $('#context-rightInfo-IF-NHA' + nodeNum + '_' + iNum)[0];
  //   $(e).attr('readonly', true);
  // }

}

//ルーティングテーブルを追加
 addRoutingTable = function(plus) {
  console.log('plusのクラス: ' + $(plus).attr('class'));
  $('ul form .context-RoutingTable tr:last-child').after('<tr align="center"></tr>');
  img = $('.ui-droppable img');

  for(i=0; i < img.length; i++){
    if (img[i].alt === $(plus).attr('class')) {
      element = img[i]
    }
  }

  if ($(element).attr('data-routingtableNum') === undefined) {
      $(element).attr('data-routingtablenum', 1);
      num = 1;
  }
  else {
      num = parseInt($(element).attr('data-routingtablenum'));
      num += 1;
      $(element).attr('data-routingtablenum', num);
  }

  //routingtableに追加
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-IP' + element.alt.slice(6) + '_' + num + '"  type="text" size="13" onKeyUp="return fCopy(this);"/>/' +
  '<input id="routingtable-SM' + element.alt.slice(6) + '_' + num +'" type="text" size="1" onKeyUp="return fCopy(this);"/>→</td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td><input id="routingtable-NHA' + element.alt.slice(6) + '_' + num + '" type="text" size="13" onKeyUp="return fCopy(this);"/></td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<td>if<input id="routingtable-IF' + element.alt.slice(6) + '_' + num + '" type="text" size="1" onKeyUp="return fCopy(this);"></td>');
  $('ul form .context-RoutingTable tr:last-child')
  .append('<img src="/assets/minus.jpg" id="minus' + element.alt.slice(6) + '_' + num + '" class="' + element.alt + '" onClick="return delRoutingTable(this)">');

  //rightinfoに追加
  $('#ns-right dt:contains("'+ element.alt +'") + dd')
  .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + element.alt.slice(6) + '_'  + num + '"></span>/<span id="rightInfo-routingtable-SM' + element.alt.slice(6) + '_'  + num +'"></span>' +
  '<br/>→<span id="rightInfo-routingtable-NHA' + element.alt.slice(6) + '_'  + num + '"></span>：IF<span id="rightInfo-routingtable-IF' + element.alt.slice(6) + '_'  + num + '"></span></p>');
}

//ルーティングテーブルを削除
delRoutingTable = function(minus) {
  console.log(minus.id);
  minusid = minus.id.slice(5);
  element = $('#ns-main img[alt="' + $(minus).attr('class') + '"]');
  num = $(element).attr('data-routingtablenum');
  $(element).attr('data-routingtablenum', num-1);
  $('ul #routingtable-IP' + minusid).parent().parent()[0].remove();
  // if ($('#routingtable-IP' + minus.id).length > 0) {
  //     $('#routingtable-IP' + minus.id).parent().parent()[0].remove();
  // }
  $('#rightInfo-routingtable-IP' + minusid).parent()[0].remove();

  //ルーティングテーブルとrightをつめる
  for(i=0, j=1; i < num; i++, j++){
    if ($('#rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i).length == 0) {
      $('#rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-SM' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-SM' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + i);
      $('#rightInfo-routingtable-IF' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'rightInfo-routingtable-IF' + $(minus).attr('class').slice(6) + '_' + i);

    }
    if (($('ul #routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i).length == 0)) {
      $('ul #routingtable-IP' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-IP' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-SM' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-SM' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-NHA' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #routingtable-IF' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'routingtable-IF' + $(minus).attr('class').slice(6) + '_' + i);
      $('ul #minus' + $(minus).attr('class').slice(6) + '_' + j).attr('id', 'minus' + $(minus).attr('class').slice(6) + '_' + i);
    }
  }
}

//削除
nodeDel = function(e) {
  nodeName = $(e).attr('class'); //消去したいノードの名前
  delNode = $('[alt=' + nodeName + ']')[0]; //消去したいノードの要素
  delNodeClass = $(delNode).attr('class').split(' ');
  delNodeIf = [];
  mainCanvasHeight = $('#ns-main-canvas').attr('data-y') - 35;
  mainCanvasWidth = $('#ns-main-canvas').attr('data-x') - 35;

  split_lan = $('#ns-main-canvas').attr('class').split(/\s?L_/);

  //線を削除
  $('#ns-main-canvas')[0].getContext('2d').clearRect(0, 0, $('#ns-main').width(), $('#ns-main').height());

  //delnodeにつながっているインターフェースを削除
  for(i=0; i < split_lan.length; i++){
    if ($(delNode).hasClass('sP_' + split_lan[i])) {
      dataLanIf =  $('.eP_' + split_lan[i]).attr('data-lan-if').split(' ');

      for(j=0; j < dataLanIf.length; j++){
        dataLanIf[j] = dataLanIf[j].split('-');

        if (dataLanIf[j][0] == split_lan[i]) {
          //消去する要素の後の要素を取得
          changeElement = $('#rightInfo-IP' + $('.eP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().nextAll();
          //rightInfoから削除
          $('#rightInfo-IP' + $('.eP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().remove();
          //rightInfoの見かけの番号を-1
          for(k=0; k < changeElement.length; k++){
            if ($(changeElement[k]).children().hasClass('num')) {
              num = parseInt($(changeElement[k]).children()[0].innerHTML.slice(3)) - 1;
              element = $(changeElement[k]).children()[0]
              $(element).html('IP-' + num);
            }
          }
          //data-lannunを-1
          $('.eP_' + split_lan[i]).attr('data-ifnum', parseInt($('.eP_' + split_lan[i]).attr('data-ifnum')) - 1)
        }
      }
      $('#ns-main img').removeClass('eP_' + split_lan[i]);
      $('#ns-main-canvas').removeClass('L_' + split_lan[i]);
    }
    else if ($(delNode).hasClass('eP_' + split_lan[i])) {
      dataLanIf =  $('.sP_' + split_lan[i]).attr('data-lan-if').split(' ');

      for(j=0; j < dataLanIf.length; j++){
        dataLanIf[j] = dataLanIf[j].split('-');

        if (dataLanIf[j][0] == split_lan[i]) {
          //消去する要素の後の要素を取得
          changeElement = $('#rightInfo-IP' + $('.sP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().nextAll();
          //rightInfoから削除
          $('#rightInfo-IP' + $('.sP_' + split_lan[i])[0].alt.slice(6) + '_' + dataLanIf[j][1]).parent().remove();
          //rightInfoの見かけの番号を-1
          for(k=0; k < changeElement.length; k++){
            if ($(changeElement[k]).children().hasClass('num')) {
              num = parseInt($(changeElement[k]).children()[0].innerHTML.slice(3)) - 1;
              element = $(changeElement[k]).children()[0]
              $(element).html('IP-' + num);
            }
          }
          //data-lannunを-1
          $('.sP_' + split_lan[i]).attr('data-ifnum', parseInt($('.sP_' + split_lan[i]).attr('data-ifnum')) - 1)
        }
      }
      $('#ns-main img').removeClass('sP_' + split_lan[i]);
      $('#ns-main-canvas').removeClass('L_' + split_lan[i]);
    }
  }

  $('#ns-main img:not([class*="P_"])').removeClass('lanLink');

  // lanLinkがないとき
  if(!($('#ns-main .ui-draggable').hasClass('lanLink'))) {
    $('#ns-main').off('mousedown');
    $('#ns-main').off('mouseup');
    $('html').off('mouseup');
  }

  //ns-rightから削除する
  $('#ns-right dt:contains("'+ nodeName +'"), #ns-right dt:contains("'+ nodeName +'") + dd').remove();

  // for(i=0; i < delNodeIf.length; i++){
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '") + p').remove();
  //   $('.rightInfo-IPSM:contains("IP-' + delNodeIf[i] + '")').remove();
  // }

  delNode.remove();

}

//bussのコンテキストメニュー
busscontextmenu = function(element) {
  // console.log(element);
}

bussDel = function(e) {}

//パケットアニメーション
packetAnimation = function(e) {
  animeData = $(e).attr('class').split('-');
  animationData = [];
  mainCanvasX = $('#ns-main-canvas').attr('data-x');
  mainCanvasY = $('#ns-main-canvas').attr('data-y');

  $('.animecanvasflag').remove();

  if (animeData[animeData.length-2].slice(0, 3) == 'bus') {
    animeData.splice(animeData.length-2, 1);
  }

  for(i=0, count=0; i < animeData.length; i++, count++){
    if (animeData[i].slice(0, 3) == 'bus') {
      animationData[count] = new Object();
      animationData[count].name = 'Start' + animeData[i];
      count++;
      animationData[count] = new Object();
      animationData[count].name = 'End' + animeData[i];
    }
    else {
      $('#ns-main img[alt="' + animeData[i] + '"]').each(function (j, e) {
        animationData[count] = new Object();
        animationData[count].name = e.alt;
        animationData[count].animecanvasX = e.x  - mainCanvasX;
        animationData[count].animecanvasY = e.y  - mainCanvasY;
        animationData[count].packetanimeX = e.x + 23;
        animationData[count].packetanimeY = e.y + 23;
      });
    }
    if (i == animeData.length-1) {
      animationData[count] = animeData[i];
    }
  }

  //busの座標
  for(i=0; i < animationData.length-1; i++){
    if (animationData[i].name.slice(0, 5) == 'Start') {
      animationData[i].animecanvasX = animationData[i-1].animecanvasX;
      animationData[i].animecanvasY = $('#ns-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - mainCanvasY - 30;
      animationData[i].packetanimeX = animationData[i-1].packetanimeX;
      animationData[i].packetanimeY = $('#ns-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - 3;
    }
    else if (animationData[i].name.slice(0, 3) == 'End'){
      animationData[i].animecanvasX = animationData[i+1].animecanvasX;
      animationData[i].animecanvasY = $('#ns-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - mainCanvasY - 30;
      animationData[i].packetanimeX = animationData[i+1].packetanimeX;
      animationData[i].packetanimeY = $('#ns-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - 3;
    }
  }

  //canvasに追加
  $("#ns-main").append(
    $("<div>").attr({
      class: "PacketAnime",
      style: "position: absolute; top: " + animationData[0].packetanimeY + "px; left: "+ animationData[0].packetanimeX +"px; width:30px; height:30px;"
    }));


  $('#ns-main').append('<canvas width="600" height="400" id="animecanvas"></canvas>');

  canvas = document.getElementById('animecanvas');
  context = canvas.getContext("2d");

  context.beginPath();
  context.arrow(animationData[0].animecanvasX, animationData[0].animecanvasY, animationData[1].animecanvasX, animationData[1].animecanvasY, [0, 1, -20, 5, -20, 12]);
  context.fill();

  moveAnimation(1)

  //描画
  moveAnimation = function(i) {

    $('.PacketAnime')
      .hide().fadeIn(200).animate({})
      .animate({
        left: animationData[i].packetanimeX,
        top: animationData[i].packetanimeY
      },{
        duration: 500,
        complete:function () {
          if (animationData[i+1] != undefined) {
            context.beginPath();
            context.arrow(animationData[i].animecanvasX, animationData[i].animecanvasY, animationData[i+1].animecanvasX, animationData[i+1].animecanvasY, [0, 1, -20, 5, -20, 12]);
            context.fill();
          }
          if (i == animationData.length-1) {
            $('#animecanvas').addClass('animecanvasflag');
            $(".PacketAnime").remove();
            if (animationData[i] == 1) {
              $('.animecanvasflag').remove();
              for(j=0; j < animationData.length-1; j++){
                if (animationData[j].name.slice(0, 2) == 'PC' || animationData[j].name.slice(0, 6) == 'Router') {
                  animationData[j].packetanimeX = animationData[j].packetanimeX - 35;
                  animationData[j].packetanimeY = animationData[j].packetanimeY - 35;
                  $("#ns-main").append(
                    $("<div>").attr({
                      class: "cssCircle",
                      style: "position: absolute; top: " + animationData[j].packetanimeY + "px; left: "+ animationData[j].packetanimeX +"px; width:100px; height:100px;"
                    }));
                  $('.cssCircle:last-child').append(
                    $('<img>').attr({
                      src: '/assets/circle.png'
                    }));
                }
              }
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            }
            if (animationData[i] == 0) {

              $("#animecanvas").drawRect({
                strokeStyle: "red",
                strokeWidth: 1,
                x: animationData[i-1].animecanvasX,
                y: animationData[i-1].animecanvasY,
                width: 80,
                height: 80
              });

              style = $('#ns-main img[alt=' + animationData[i-1].name + ']').attr('style');

              animationData[i-1].packetanimeX = animationData[i-1].packetanimeX - 30;
              animationData[i-1].packetanimeY = animationData[i-1].packetanimeY - 30;

              $("#ns-main").append(
                $("<div>").attr({
                  class: "cssCross",
                  style: "position: absolute; top: " + animationData[i-1].packetanimeY + "px; left: "+ animationData[i-1].packetanimeX +"px; width:100px; height:100px;"
                }));

              $('#ns-main img[alt=' + animationData[i-1].name + ']').addClass('hurueru');

              $(".hurueru").css({
                'display': 'inline-block',
                'animation': 'hurueru .1s 9'
              });

              $('.cssCross').append(
                $('<img>').attr({
                  src: '/assets/cross.png'
                }));

              $('.cssCross').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCross').remove();
                    $('#ns-main img[alt=' + animationData[i-1].name + ']').attr('style', style);
                    $('#ns-main img[alt=' + animationData[i-1].name + ']').removeClass('hurueru');
                  })
                })
              });
            }
          }
          else {
            moveAnimation(i+1);
          }
        }
    });
  }

}
