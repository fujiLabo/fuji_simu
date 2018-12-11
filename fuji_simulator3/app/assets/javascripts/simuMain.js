//mainファイル
//直接htmlを操作する

//他のファイルが読み込まれてからこのファイルを読み込む
// $.when(
//   $.ready,
//   $.getScript("/assets/simuDec.js"),
//   $.getScript("/assets/simuFunc.js"),
// ).then(function(){
$(function(){

  /*
   * ネットワークシミュレータのプログラム
   * メインのコードを書いている
   *
   * do: 最低限の動作を作成完了
   *     データを渡すアルゴリズムがまだ最低限の仕様なので、改良予定
   *
   * bg: 勝手に線が消える (時間を置くと消える･･･? しかも消えた線が勝手に復活する･･･ 原因不明 Canvasの仕様?)(中)
   *
   *primaryコード
   *0→中継ノード
   *1→ルーター
   *2→クライアント
   *3→サーバー
   全部jsonではきだす
   プロセス間通信
   ルーティングテーブル

   文字列を入れる

   12月まで
   １問題選択
   問題選択画面を出す（データベースに問題番号送信）
   正解した問題には目印をつける（問題を開いたときに取得）
   ２回答
   回答データ送信
   ３終了
   点数出力（？）
   ロールについて
   ページ開いたとき前回の成績を反映
   終了ボタンを押したときに成績を表示・
   node-if-lan
   divを追加する時
   ・main-canvasに追加する場合 -> x +
   */


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
          num = $('#nsf-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
          //$('#nsf-right:contains').attr
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
          num = $('#nsf-right dt:contains(' + nodeName + ') + dd p:contains(IP-'  + i + ') span:nth-of-type(2)').attr('id').split('_')[1];
          //$('#nsf-right:contains').attr
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

  //nsf-rightに値を入れる
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
    $('#nsf-right dt:contains("'+ element.alt +'") + dd')
    .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + element.alt.slice(6) + '_'  + num + '"></span>/<span id="rightInfo-routingtable-SM' + element.alt.slice(6) + '_'  + num +'"></span>' +
    '<br/>→<span id="rightInfo-routingtable-NHA' + element.alt.slice(6) + '_'  + num + '"></span>：IF<span id="rightInfo-routingtable-IF' + element.alt.slice(6) + '_'  + num + '"></span></p>');
  }

  //ルーティングテーブルを削除
  delRoutingTable = function(minus) {
    console.log(minus.id);
    minusid = minus.id.slice(5);
    element = $('#nsf-main img[alt="' + $(minus).attr('class') + '"]');
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
    mainCanvasHeight = $('#nsf-main-canvas').attr('data-y') - 35;
    mainCanvasWidth = $('#nsf-main-canvas').attr('data-x') - 35;

    split_lan = $('#nsf-main-canvas').attr('class').split(/\s?L_/);

    //線を削除
    $('#nsf-main-canvas')[0].getContext('2d').clearRect(0, 0, $('#nsf-main').width(), $('#nsf-main').height());

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
        $('#nsf-main img').removeClass('eP_' + split_lan[i]);
        $('#nsf-main-canvas').removeClass('L_' + split_lan[i]);
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
        $('#nsf-main img').removeClass('sP_' + split_lan[i]);
        $('#nsf-main-canvas').removeClass('L_' + split_lan[i]);
      }
    }

    $('#nsf-main img:not([class*="P_"])').removeClass('lanLink');

    // lanLinkがないとき
    if(!($('#nsf-main .ui-draggable').hasClass('lanLink'))) {
      $('#nsf-main').off('mousedown');
      $('#nsf-main').off('mouseup');
      $('html').off('mouseup');
    }

    //nsf-rightから削除する
    $('#nsf-right dt:contains("'+ nodeName +'"), #nsf-right dt:contains("'+ nodeName +'") + dd').remove();

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
    mainCanvasX = $('#nsf-main-canvas').attr('data-x');
    mainCanvasY = $('#nsf-main-canvas').attr('data-y');

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
        $('#nsf-main img[alt="' + animeData[i] + '"]').each(function (j, e) {
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
        animationData[i].animecanvasY = $('#nsf-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - mainCanvasY - 30;
        animationData[i].packetanimeX = animationData[i-1].packetanimeX;
        animationData[i].packetanimeY = $('#nsf-main div[alt="' + animationData[i].name.slice(5) + '"]')[0].offsetTop - 3;
      }
      else if (animationData[i].name.slice(0, 3) == 'End'){
        animationData[i].animecanvasX = animationData[i+1].animecanvasX;
        animationData[i].animecanvasY = $('#nsf-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - mainCanvasY - 30;
        animationData[i].packetanimeX = animationData[i+1].packetanimeX;
        animationData[i].packetanimeY = $('#nsf-main div[alt="' + animationData[i].name.slice(3) + '"]')[0].offsetTop - 3;
      }
    }

    //canvasに追加
    $("#nsf-main").append(
      $("<div>").attr({
        class: "PacketAnime",
        style: "position: absolute; top: " + animationData[0].packetanimeY + "px; left: "+ animationData[0].packetanimeX +"px; width:30px; height:30px;"
      }));


    $('#nsf-main').append('<canvas width="600" height="400" id="animecanvas"></canvas>');

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
                    $("#nsf-main").append(
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

                style = $('#nsf-main img[alt=' + animationData[i-1].name + ']').attr('style');

                animationData[i-1].packetanimeX = animationData[i-1].packetanimeX - 30;
                animationData[i-1].packetanimeY = animationData[i-1].packetanimeY - 30;

                $("#nsf-main").append(
                  $("<div>").attr({
                    class: "cssCross",
                    style: "position: absolute; top: " + animationData[i-1].packetanimeY + "px; left: "+ animationData[i-1].packetanimeX +"px; width:100px; height:100px;"
                  }));

                $('#nsf-main img[alt=' + animationData[i-1].name + ']').addClass('hurueru');

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
                      $('#nsf-main img[alt=' + animationData[i-1].name + ']').attr('style', style);
                      $('#nsf-main img[alt=' + animationData[i-1].name + ']').removeClass('hurueru');
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


  $(function(){

    //初期位置に戻す
    $('html').scrollTop(0);
    $('html').scrollLeft(0);

  // 変数の定義

  if ( typeof NSF === "undefined" ) var NSF = {};

  // nsf-all var
  NSF.pcNode = 0;  // PCの数
  NSF.ruNode = 0;  // Routerの数
  NSF.busNode = 0; //busの数
  NSF.swNode = 0;  // Switchの数
  NSF.svNode = 0;  // Serverの数
  NSF.lanNode = 0; // LanNodeの数

  // nsf-main var
  NSF.mainDropFlg     = true; // Draggableのフラグ
  NSF.dropNodeInt     = 0;    // DropNodeの個数
  NSF.dropNodeName    = "";   // DropNodeの名前
  NSF.dropContextName = "";   // DropNodeのContextMenuの名前

  // nsf-canvas var
  NSF.points          = []; // ドラッグ時のマウスの座標の配列
  NSF.lanArrClass     = []; // nsf-main-canvasのクラスの配列
  NSF.lanArrWidth     = []; // LANの帯域幅の配列
  NSF.lanWidth        = 2;  // LANの幅
  NSF.lanFlag         = false;  // LANのフラグ   (画像に乗っているとき)
  NSF.busFlag        = false;
  NSF.busDrawFrag    = false;
  NSF.lanFlaglink;          // LANのフラグ2  (lanLinkがあるとき)
  NSF.lanFlagPoint;         // LANのフラグ3  (lanDownが実行されたとき)
  NSF.lanFlagDelet;         // LANのフラグ4  (lanDownの削除するとき)
  NSF.lanFlagMove;          // LANのフラグ5  (lanMoveDownが実行されたとき)
  NSF.elLanMoveThis;        // LANMoveのクエリのキャッシュ
  NSF.addCtx;               // 追加したCanvasのAPIにアクセスできるオブジェクト
  NSF.addCanvas;            // 追加したCanvasを格納
  NSF.canvasWidth      = $('#nsf-main').width();  // nsf-mainの幅
  NSF.canvasHeight     = $('#nsf-main').height(); // nsf-mainの高さ
  NSF.mainCanvasWidth  = $('#nsf-main-canvas')[0].getBoundingClientRect().left - 35;
  NSF.mainCanvasHeight = $('#nsf-main-canvas')[0].getBoundingClientRect().top - 35;
  NSF.mainCanvasX      = $('#nsf-main-canvas')[0].getBoundingClientRect().left;
  NSF.mainCanvasY      = $('#nsf-main-canvas')[0].getBoundingClientRect().top;
  NSF.questionCanvasX  = $('#nsf-main-canvas')[0].getBoundingClientRect().left + 150;
  NSF.questionCanvasY  = $('#nsf-main-canvas')[0].getBoundingClientRect().top + 60;
  NSF.mainCtx          = $('#nsf-main-canvas')[0].getContext('2d'); // nsf-main-canvasをAPIにアクセスできるオブジェクト
  NSF.mainCtx.strokeStyle = '#2fb9fe';                              // 線の色を青色に設定

  // nsf-glay var
  NSF.bGlayFladg = false; // glayLayerのフラグ

  //animecanvasのフラグ
  NSF.animecanvasFlag = false;

  //urlパラメータを取得
  var arg = new Object;
  var pair=location.search.substring(1).split('&');
  for(var i=0;pair[i];i++) {
      var kv = pair[i].split('=');
      NSF.urlparameter=kv[1];
  }

  //nsf-mainのxy
  $('#nsf-main-canvas').attr('data-x', NSF.mainCanvasWidth);
  $('#nsf-main-canvas').attr('data-y', NSF.mainCanvasHeight);



  // 関数の定義


  //nsf-nav Fnction

  // 全要素の削除
  NSF.fnAllReset = function() {
    // 変数のリセット
    NSF.pcNode  = 0;
    NSF.swNode  = 0;
    NSF.svNode  = 0;
    NSF.ruNode  = 0;
    NSF.lanNode = 0;
    // コンソールとトポロジーの文字を削除
    $("#nsf-right dl").html("");
    $("#nsf-console").html("");
    // lanLinkがある時
    if($("#nsf-main .ui-draggable").hasClass("lanLink")) {
      $("#nsf-main").off("mousedown", NSF.fnLanMoveDown);
      $("#nsf-main").off("mouseup", NSF.fnLanMoveUp);
      $("html").off("mouseup", NSF.fnLanMoveOutUp);
    }
    // 画像と線の削除
    $("#nsf-main img").remove();
    $('.bus').remove();
    $('#nsf-main-canvas').removeClass();
    $('#nsf-main-canvas').attr('data-buslan', '');
    NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
  }

  // パケット画像の変更
  NSF.fnPacketChenge = function(set1, set2, set3) {
    if($("#"+ set1 +"-packet").attr("src") === "/assets/"+ set1 +"_1.png") {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_2.png");
      if($("#"+ set2 +"-packet").attr("src") === "/assets/"+ set2 +"_2.png") {
        $("#"+ set2 +"-packet").attr("src", "/assets/"+ set2 +"_1.png");
      }
      else if($("#"+ set3 +"-packet").attr("src") === "/assets/"+ set3 +"_2.png") {
        $("#"+ set3 +"-packet").attr("src", "/assets/"+ set3 +"_1.png");
      }
    }
    else {
      $("#"+ set1 +"-packet").attr("src", "/assets/"+ set1 +"_1.png");
    }
  }

  // パケットの追加
  NSF.fnPacketAdd = function() {
    var elthis = $(this);
    // get-nodeを付加する処理
    if($("#get-packet").attr("src") === "/assets/get_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) { }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) {
        elthis.removeClass("send-node");
        elthis.prev().remove();
        NSF.fnSetBadge(this, "get-node");
      }
      // get-node と send-nodeがないとき
      else {
        NSF.fnSetBadge(this, "get-node");
      }
    }
    // send-nodeを付加する処理
    else if($("#send-packet").attr("src") === "/assets/send_2.png") {
      // get-nodeがあるとき
      if(elthis.hasClass("get-node")) {
        $(".send-node").prev().remove();
        $("#nsf-main img").removeClass("send-node");
        elthis.removeClass("get-node");
        elthis.prev().remove();
        NSF.fnSetBadge(this, "send-node");
      }
      // send-nodeがあるとき
      else if(elthis.hasClass("send-node")) { }
      // get-node と send-nodeがないとき
      else {
        $(".send-node").prev().remove();
        $("#nsf-main img").removeClass("send-node");
        NSF.fnSetBadge(this, "send-node");
      }
    }
    // nodeをリセットする処理
    else if($("#reset-packet").attr("src") === "/assets/reset_2.png") {
      if(elthis.hasClass("get-node") || elthis.hasClass("send-node")) {
        elthis.prev().remove();
        elthis.removeClass("get-node");
        elthis.removeClass("send-node");
      }
    }
  }

  // GlayLayerを表示 (New)
  NSF.fnGlayOpen = function() {
    // glayLayerのフラグを true にする
    NSF.bGlayFladg = true;
    // ID glayLayerの座標と大きさの指定
    $("#glayLayer").css({
      display: 'block',
    });
    $("#glayLayer").animate({
      top:    $("#nsf-container").offset().top,
      left:   $("#nsf-container").offset().left,
      height: $("#nsf-container").height() - 4,
      width:  $("#nsf-container").width() - 4,
    }, 500);
  }

  // 左矢印ボタンが押されたとき
  NSF.fnGlayInfoLeft = function() {
    $("#slideUl:not(:animated)")
    .css("margin-left", -1*$("#slideUl li").width())
    .prepend($("#slideUl li:last-child"))
    .animate({
      "margin-left" : 0
    }, function(){ });
  }

  // 右矢印ボタンが押されたとき
  NSF.fnGlayInfoRight = function() {
    $("#slideUl:not(:animated)").animate({
      "margin-left" : -1*$("#slideUl li").width()
    }, function(){
      $("#slideUl").css("margin-left", "0");
      $("#slideUl").append($("#slideUl li:first-child"));
    });
  }

  // 問題のタイトルを押されたとき (Update)
  NSF.fnGlayStudyTitleInfo = function() {
    $("#studyLeftTitle").text($(this).text());
  }

  // 閉じるボタンが押されたとき (Update)
  NSF.fnAllGlayClose = function() {
    // 変数のリセット
    NSF.bGlayFladg = false;
    // イベントハンドラの削除
    $("#infoLeft").off('click', NSF.fnGlayInfoLeft);
    $("#infoRight").off('click', NSF.fnGlayInfoRight);
    $("#glayClose").off('click', NSF.fnAllGlayClose);
    $("#studyMenuButtonIn").off('click', NSF.fnGlayStudyInput);
    $("#studyMenuButtonOut").off('click', NSF.fnGlayStudyOutput);
    // GlayLayerを設定
    $("#glayLayer").css({'display':'none','height':0});
    $("#glayLayer").empty();
  }

  NSF.fnQuestionSelectClose = function() {
    // イベントハンドラの削除
    //$("#questionClose").off('click', NSF.fnAllGlayClose);
    // GlayLayerを設定
    $("#questionLayer").css({'display':'none','height':0});
    $("#questionLayer").empty();
    // $("#check").on('click', NSF.IndicateNodeInfo);
    // $("#study").on('click', NSF.fnstudy);
    // $("#save").on('click', NSF.fnsave);
    // $("#load").on('click', NSF.fnload);
    // $("#quit").on('click', NSF.fnquit);
  }

  //lanボタンが押された時
  NSF.changeLanMode = function () {
    NSF.fnAllGlayClose();
    NSF.fnQuestionSelectClose();
    var elHtml     = $("html");
    var elMain     = $("#nsf-main");
    var elMainDrag = $("#nsf-main .ui-draggable");
    // OFFのとき
    if($('#lan').attr("src") === "/assets/lanCable.png") {
      // 画像を ONに変更
      $('#lan').attr("src", "/assets/lanCable_2.png");
      // イベントハンドラーを付ける
      elMain.on("mousedown", NSF.fnLanDown);
      elMain.on("mouseup", NSF.fnLanUp);
      elHtml.on("mouseup", NSF.fnLanOutUp);
      // elMain.on("mousedown", NSF.fnBusDown);
      // elMain.on("mouseup", NSF.fnBusUp);
      // elHtml.on("mouseup", NSF.fnBusOutUp);
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.off("mousedown", NSF.fnLanMoveDown);
        elMain.off("mouseup", NSF.fnLanMoveUp);
        elHtml.off("mouseup", NSF.fnLanMoveOutUp);
      //   elMain.off("mousedown", NSF.fnBusMoveDown);
      //   elMain.off("mouseup", NSF.fnBusMoveUp);
      //   elHtml.off("mouseup", NSF.fnBusMoveOutUp);
      }
      // カーソルの変更
      elMain.css("cursor", "crosshair");
      elMainDrag.css("cursor", "crosshair");
      // 画像のドラッグ防止
      elMainDrag.mouseup(function(e) { e.preventDefault(); });
      elMainDrag.mousedown(function(e) { e.preventDefault(); });
      // 画像にマウスが乗った時の動作
      elMainDrag.mouseenter(function(){
        // フラグの設定
        NSF.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        // フラグの設定
        NSF.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
      //busをoffにする
      $('#bus').prop('checked',false);
      $("#nsf-main").off("mousedown", NSF.fnBusDown);
      $("#nsf-main").off("mouseup", NSF.fnBusUp);
      $("html").off("mouseup", NSF.fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    // ONのとき
    else if($('#lan').attr("src") === "/assets/lanCable_2.png") {
      // 画像を OFFに変更
      $('#lan').attr("src", "/assets/lanCable.png");
      // イベントハンドラーの削除
      elMain.off("mousedown", NSF.fnLanDown);
      elMain.off("mouseup", NSF.fnLanUp);
      elHtml.off("mouseup", NSF.fnLanOutUp);
      elMainDrag.off("mouseenter").off("mouseleave");
      // カーソルの変更
      elMain.css("cursor", "auto");
      elMainDrag.css("cursor", "pointer");
      // lanLinkがある時
      if(elMainDrag.hasClass("lanLink")) {
        elMain.on("mousedown", NSF.fnLanMoveDown);
        elMain.on("mouseup", NSF.fnLanMoveUp);
        elHtml.on("mouseup", NSF.fnLanMoveOutUp);
      }
    }
  }

  //トポロジーを再構成
  NSF.fnReconstructionTopology = function (Qdata) {


    $('#nsf-main-canvas').attr('class', Qdata.lanInfo);
    $('#nsf-main-canvas').attr('data-buslan', Qdata.busInfo);
    // 座標を計算する（winsow.offsetはスクロールしたときの座標を加味している）
    var positionX = NSF.mainCanvasX;	// 要素のX座標
    var positionY = NSF.mainCanvasY;	// 要素のY座標

    //main-canvasにnode出力
    for(i = 0; i < Qdata.nodeInfo.length; i++){
      //positionX += positionX / 105; //X軸位置調整
      //positionY += positionY / 58;  //Y軸位置調整
      var style_positionX = positionX + Qdata.nodeInfo[i].x;
      var style_positionY = positionY + Qdata.nodeInfo[i].y;

      if (Qdata.nodeInfo[i].name.substr(0,2) === 'PC') {
        NSF.pcNode++;
        $('#nsf-main').append(
          $('<img>').attr({
            src: "/assets/pc.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#nsf-right dl').append('<dt><img src= /assets/plus.jpg> <span>' + Qdata.nodeInfo[i].name + '</span></dt>' +
        '<dd><p class="rightInfo-IPSM">IP-0: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].ip + '</span> /<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(2) + '">' + Qdata.nodeInfo[i].sm + '</span></p>' +
        '<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].ip + '</span>/' +
        '<span id="rightInfo-PCroutingtable-SM' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].sm + '</span><br>→' +
        '<span id="rightInfo-PCroutingtable-NHA' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].nha + '</span>：IF' +
        '<span id="rightInfo-PCroutingtable-IF' + Qdata.nodeInfo[i].name.slice(2) + '_0">' + Qdata.nodeInfo[i].routingtable[0].if + '</span></p></dd>');

        //readolyクラスをつける
        // for(j = 0; j  < Qdata.nodeInfo[i].readonly.length; j++){
        //   $('#nsf-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }

      }
      else if (Qdata.nodeInfo[i].name.substr(0,6) === 'Router'){
        NSF.ruNode++;
        $('#nsf-main').append(
          $('<img>').attr({
            src: "/assets/router.png",
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;',
            'data-ifnum': Qdata.nodeInfo[i].ifnum,
            'data-lan-if': Qdata.nodeInfo[i].lanif,
            'data-linknum': Qdata.nodeInfo[i].linknum,
            'data-routingtablenum': Qdata.nodeInfo[i].routingtablenum,
            'oncontextmenu': 'return fncontextmenu(this)'
          }));

        $('#nsf-right dl').append('<dt style=""><img src="/assets/plus.jpg"><span>' + Qdata.nodeInfo[i].name + '</span></dt><dd></dd>');


        $('#nsf-right dl dd:last-child').append('<div class="rightInfo-IPSM"></div>');
        for(j=0; j < Qdata.nodeInfo[i].ip.length; j++){
          $('#nsf-right dl dd:last-child').append('<p class="rightInfo-IPSM"><span id="' + j + '"class="num">IP-' + j + '</span>: <span id="rightInfo-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].ip[j] + '</span>' +
          '/<span id="rightInfo-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j +'">' + Qdata.nodeInfo[i].sm[j] + '</span></p>');
        }

        for(j=0; j < Qdata.nodeInfo[i].routingtable.length; j++){
          $('#nsf-right dl dd:last-child').append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].ip + '</span>' +
          '/<span id="rightInfo-routingtable-SM' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].sm + '</span>' +
          '<br>→<span id="rightInfo-routingtable-NHA' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].nha + '</span>' +
          '：IF<span id="rightInfo-routingtable-IF' + Qdata.nodeInfo[i].name.slice(6) + '_' + j + '">' + Qdata.nodeInfo[i].routingtable[j].if + '</span></p></dd>');
        }



        //readolyクラスをつける
        // for(j=0; j  < Qdata.lanInfo[i].readonly.length; j++){
        //   $('#nsf-main img:last-child').addClass(Qdata.data[i].readonly[j]);
        // }


      }
      else {
        $('#nsf-main').append(
          $('<div>').attr({
            alt: Qdata.nodeInfo[i].name,
            class: Qdata.nodeInfo[i].class,
            style: 'position: absolute; top: ' + style_positionY + 'px; left: ' + style_positionX + 'px;  width: ' + Qdata.nodeInfo[i].width + 'px; height: ' + Qdata.nodeInfo[i].height + 'px;'
          }));
      }

      //nsf-rightの情報を隠す
      $("#nsf-right dd:last").css("display","none");

      //画像をドラッグできるようにする
      $("#nsf-main img:last-child").draggable({
        containment: 'parent',
        zIndex: 2,
        // ドラッグ中
        drag: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().offset({
              top:  this.offsetTop - 15,
              left: this.offsetLeft + 42,
            });
            $(this).prev().css('zIndex', 3);
          }
        },
        // // ドラッグ終了
        stop: function(){
          if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
            $(this).prev().css('zIndex', 1);
          }
        },
      });


      //実際に配置されたときの配置を取得（slice()でpxを削除）
      // Qdata.nodeInfo[i].positionX = $('#nsf-main img:last-child')[0].style.left.slice(0, -2);
      // Qdata.nodeInfo[i].positionY = $('#nsf-main img:last-child')[0].style.top.slice(0, -2);
    }

    NSF.fnDraw();

    //nsf-rightの情報を隠す
    $("#nsf-right dd:last").css("display","none");

    //イベントハンドラを付けるためにLanModeを切り替える（2回切り替えて元に戻している）（改良して）
    NSF.changeLanMode();
    NSF.changeLanMode();
  }

  //問題を選択
  NSF.fnstudySelect = function () {

    //タイトルを取得
    NSF.question_id = $(this).attr('data-qid');


    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/sample2.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{question_id : NSF.question_id, id : NSF.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      NSF.fnAllReset();
      $("#nsf-console").append("<p>> 問題を取得しました </p>");
      //トポロジーを再現
      NSF.fnReconstructionTopology(Qdata);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#nsf-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      NSF.fnQuestionSelectClose();
      // イベントハンドラの追加と削除
      $("#questionClose").off('click', NSF.fnQuestionSelectClose);
      $("#studySelect").off('click', NSF.fnstudySelect);
      $(".qusetion-select-button").off('click', NSF.fnstudySelect);
      // $("#check").on('click', NSF.IndicateNodeInfo);
      // $("#study").on('click', NSF.fnstudy);
      // $("#save").on('click', NSF.fnsave);
      // $("#load").on('click', NSF.fnload);
      // $("#quit").on('click', NSF.fnquit);
    });
  }

  //トポロジーをロード
  NSF.fnloadSelect = function () {
    //タイトル取得
    // var studyTitleValue = $("#studySelectTitle").val();

    NSF.question_id = $(this).attr('data-qid');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/sample2.json',
      //moodleで動かす場合は上をコメントアウトして下を使う
      //url: 'NewNetworkSimulator/js/temporary_load.php',
      data:{question_id : NSF.question_id, id : NSF.urlparameter}
    }).done(function(data) {

      //取得したJSONをオブジェクトに戻す
      var Qdata = JSON.parse(data);
      //問題文を表示
      questiontext.txt.value = Qdata.text;
      //問題番号を表示
      $("#question span").html(Qdata.id);
      // 要素の全削除
      NSF.fnAllReset();
      $("#nsf-console").append("<p>>トポロジーを読み込みました</p>");
      //トポロジーを再現
      NSF.fnReconstructionTopology(Qdata);

    }).fail(function(XMLHttpRequest, textStatus) {
      $("#nsf-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){ NSF.fnQuestionSelectClose(); });

  }

  //モードを切り替える
  NSF.fnchangeMode = function () {

    //全削除
    NSF.fnAllReset();

    //自由描画モードのとき
    if ($(".change_mode").hasClass('draw')) {

      //nsf-navに追加
      $("#nsf-nav :nth-of-type(8)")
      .after("<div class='tooltip tooltip_study add_nav'><img src='/assets/study.png' id='study' title='練習問題'><span>問題を表示します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_save add_nav'><img src='/assets/save.png' id='save' title='セーブ'><span>現在のネットワーク構成を保存します</span></div>" +
      "<div class='add_height_line' id='add_line'></div>" +
      "<div class='tooltip tooltip_load add_nav'><img src='/assets/load.png' id='load' title='ロード'><span>セーブした問題のネットワーク構成を復元します</span></div>" +
      "<div class='add_height_line add_nav' id='add_line'></div>" +
      "<div class='tooltip tooltip_quit add_nav'><img src='/assets/quit.png' id='quit' title='終了'><span>問題演習を終了します</span></div>" +
      "<div class='add_height_line' id='line'></div>");

      //イベントハンドラを付ける
      $("#study").on('click', NSF.fnstudy);
      $("#save").on('click', NSF.fnsave);
      $("#load").on('click', NSF.fnload);
      $("#quit").on('click', NSF.fnquit);

      //dustのイベントハンドラを削除
      $("#dust").attr("src", "/assets/dust2.png");
      $("#dust").off('click', NSF.fnAllReset);

      //nsf-leftのイベントハンドラを削除
      // $('.machinery').draggable('destroy')
      // $('.tgl').prop('disabled', true);
      // $('#lan').off();

      //問題を出力する場所を生成
      $("#nsf-all").after("<div id='question'>問題：<span></span><form id='questiontext'>" +
      "<textarea name='txt' rows='3' cols='146' readonly></textarea></form></div>");

    }
    else if ($(".change_mode").hasClass('question')) {

      //追加したnavを削除
      $("#study").remove();
      $("#save").remove();
      $("#load").remove();
      $("#quit").remove();
      $(".add_height_line").remove();
      $("#question").remove();
      //dustにイベントハンドラを付ける
      $("#dust").attr("src", "/assets/dust.png");
      $("#dust").on('click', NSF.fnAllReset);
      // // machineryをドラッグ
      // $(".machinery").draggable({
      //   helper: 'clone',  // 要素を複製する
      //   revert: true,     // ドラッグ終了時に要素に戻る
      //   zIndex: 3,
      //   // ドラッグ開始
      //   start: function(e, ui) { $(this).addClass('dragout'); },
      //   // ドラッグ終了
      //   stop: function(e, ui) { $(this).removeClass('dragout'); },
      // });
      // // lanをクリック
      // $("#lan").click(function(){
      //   NSF.changeLanMode();
      // });
      // // LANのスター型とバス型をクリック
      // $('.tgl').prop('disabled', false);


      NSF.fnQuestionSelectClose();
    }
  }

  //studyをクリック（問題一覧を表示）
  NSF.fnstudy = function () {
    studyTitleValue = 0;
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/ques.json',
      // url: 'NewNetworkSimulator/php/collect_questions_title.php',
      data:{question_id :$('#question span').innerHTML, id : NSF.urlparameter}
    }).done(function(data) {

      NSF.fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#nsf-main").offset().top,
        left:   $("#nsf-main").offset().left,
        height: $("#nsf-main").height(),
        width:  $("#nsf-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">練習問題</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-select-button tr' + Qdata[i].grade + '" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }



    }).fail(function(XMLHttpRequest, textStatus) {
      $("#nsf-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){
      // イベントハンドラの追加と削除
      $("#questionClose").on('click', NSF.fnQuestionSelectClose);
      $("#studySelect").on('click', NSF.fnstudySelect);
      $(".qusetion-select-button").on('click', NSF.fnstudySelect);
      // $("#check").off('click', NSF.IndicateNodeInfo);
      // $("#study").off('click', NSF.fnstudy);
      // $("#save").off('click', NSF.fnsave);
      // $("#load").off('click', NSF.fnload);
      // $("#quit").off('click', NSF.fnquit);
    });
  }

  //ここから
  //saveをクリック 解読するならここからがオススメ
  NSF.fnsave = function () {
    if ( typeof NSFCSA === "undefined" ) var NSFCSA = {};

      router = [];          //routerの構造体配列
      pc = [];              //pcの構造体配列
      bus = [];
      save = new Object();
      save.nodeInfo = [];
      save.pair = [];

      //コンストラクタのようなもの
      function router_const(){
        this.name = '';
        this.ip = [];
        this.sm = [];
        this.destinationRoute = [];
        this.if = [];
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function pc_const(){
        this.name = '';
        this.ip = '';
        this.sm = '';
        this.lanLink = '';
        this.x = '';
        this.y = '';
        this.readonly = [];
      }

      function bus_const() {
        this.name = '';
        this.x = '';
        this.y = '';
        this.width = '';
        this.height = '';
        this.class = '';
      }

    //lanLinkがあるとき
    if ($('#nsf-main img').hasClass('lanLink')) {


      //Routerのname
      $('#nsf-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#nsf-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          console.log(e);
          if (j % 3 == 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 == 2) {
            router[i].sm[count] = $(e).text();
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#nsf-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < router.length; i++){
        $('#nsf-main img[alt="' + router[i].name + '"]').each(function (j, e) {
          router[i].class = $(e).attr('class');
          router[i].ifnum = $(e).attr('data-ifnum');
          router[i].lanif = $(e).attr('data-lan-if');
          router[i].linknum = $(e).attr('data-linknum');
          router[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }


      //pcのname, ip, smを取得
      $("#nsf-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        //All_PC_node++;
      });

      $("#nsf-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(1)").each(function(i, e) {
        pc[i].ip = $(e).text();
      });

      $("#nsf-right dt:contains('PC') + dd p:nth-of-type(1) span:nth-of-type(2)").each(function(i, e) {
        pc[i].sm = $(e).text();
      });

      //ルーティングテーブル
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#nsf-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //imgの情報
      for(i=0; i < pc.length; i++){
        $('#nsf-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          pc[i].class = $(e).attr('class');
          pc[i].ifnum = $(e).attr('data-ifnum');
          pc[i].lanif = $(e).attr('data-lan-if');
          pc[i].linknum = $(e).attr('data-linknum');
          pc[i].routingtablenum = $(e).attr('data-routingtablenum');
        });
      }

      //busの情報
      $('#nsf-main .bus').each(function (i, e) {
        bus[i] = new bus_const();
        bus[i].name = $(e).attr('alt');
        bus[i].class = $(e).attr('class')
        bus[i].x = e.style.left.replace("px", "") - NSF.mainCanvasX;
        bus[i].y = e.style.top.replace("px", "") - NSF.mainCanvasY;
        bus[i].width = e.style.width.replace("px", "");
        bus[i].height = e.style.height.replace("px", "");
      });

      //座標を取得
      $("#nsf-main img").each(function(i, e) {
        for(j = 0, count = 0; j < router.length; j++){
          if (router[j].name === e.alt) {
            router[j].x = e.style.left.replace("px", "") - NSF.mainCanvasX;
            router[j].y = e.style.top.replace("px", "") - NSF.mainCanvasY;

            if ($(e).hasClass('RO_sp1')) {
              router[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sp2')) {
              router[j].readonly[count] = 'RO_sp2';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              router[j].readonly[count] = 'RO_sm1';
              count++;
            }

            if ($(e).hasClass('RO_sm2')) {
              router[j].readonly[count] = 'RO_sm2';
              count++;
            }
          }
        }
        for(j = 0, count = 0; j < pc.length; j++){
          if (pc[j].name === e.alt) {
            pc[j].x = e.style.left.replace("px", "") - NSF.mainCanvasX;
            pc[j].y = e.style.top.replace("px", "") - NSF.mainCanvasY;

            //readonlyのセーブデータ
            if ($(e).hasClass('RO_sp1')) {
              pc[j].readonly[count] = 'RO_sp1';
              count++;
            }

            if ($(e).hasClass('RO_sm1')) {
              pc[j].readonly[count] = 'RO_sm1';
              count++;
            }
          }
        }
      });

      console.log(router);


      //saveDataを作成
      save.id = $("#question span")[0].textContent;
      save.text = questiontext.txt.value;

      //PCのセーブデータを作成
      for(i = 0; i < pc.length; i++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = pc[i];
        // save.data[i].name = pc[i].name;
        // save.data[i].ip = pc[i].ip;
        // save.data[i].sm = pc[i].sm;
        // save.data[i].coordinateX = pc[i].x;
        // save.data[i].coordinateY = pc[i].y;
        // save.data[i].readonly = pc[i].readonly;
      }

      //Routerのセーブデータを作成
      for(i = pc.length, j = 0; i < pc.length + router.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = router[j];
        // save.data[i].name = router[j].name;
        // save.data[i].coordinateX = router[j].x;
        // save.data[i].coordinateY = router[j].y;
        // save.data[i].readonly = router[j].readonly;
        // save.data[i].ip = [];
        // save.data[i].sm = [];
        //
        // for(k=0; k < router[j].ip.length; k++){
        //   save.data[i].ip[k] = router[j].ip[k];
        //   save.data[i].sm[k] = router[j].sm[k];
        // }
        //
        // save.data[i].routingtable = [];
        // for(k=0; k < router[j].routingtable.length; k++){
        //   save.data[i].routingtable[k] = new Object();
        //   save.data[i].routingtable[k].if = router[j].routingtable[k].if;
        //   save.data[i].routingtable[k].ip = router[j].routingtable[k].ip;
        //   save.data[i].routingtable[k].sm = router[j].routingtable[k].sm;
        //   save.data[i].routingtable[k].nha = router[j].routingtable[k].nha;
        // }
      }

      //busのセーブデータ作成
      for(i=pc.length+router.length, j=0; i < pc.length + router.length + bus.length; i++, j++){
        save.nodeInfo[i] = new Object();
        save.nodeInfo[i] = bus[j];
      }


      //lanの情報を取得
      lan_info = $('#nsf-main canvas').attr('class');
      save.lanInfo = $('#nsf-main canvas').attr('class');
      save.busInfo =  $('#nsf-main canvas').attr('data-buslan');


      JsonsaveData = JSON.stringify(save, null, " ");
      console.log(JsonsaveData);



      $.ajax({
        type: 'POST',
        dataType: 'text',
        url: 'js/save_DB.php',
        // url: 'NewNetworkSimulator/php/save_DB.php',
        data:{postJsonData : JsonsaveData, id : NSF.urlparameter, question_id : NSF.question_id}
      }).done(function(data) {
        $("#nsf-console").append("<p>>ノードの配置を保存しました  </p>");
      }).fail(function(XMLHttpRequest, textStatus) {
        $("#nsf-console").append("<p>> エラーが発生しました</p>");
      }).always(function(){});
    }
  }

  //loadをクリック
  NSF.fnload = function () {
    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/ques.json',
      // url: 'NewNetworkSimulator/php/temporary_load_title.php',
      data:{id : NSF.urlparameter}
    }).done(function(data) {


      NSF.fnQuestionSelectClose();

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(data);
      console.log(Qdata);


      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#nsf-main").offset().top,
        left:   $("#nsf-main").offset().left,
        height: $("#nsf-main").height(),
        width:  $("#nsf-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      $('#questionLayer').append('<div class="points" align="center">ロード</div>');

      for(i=0; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<button class="qusetion-load-button tr0" data-qid="' + Qdata[i].id + '"><p class="questiontext">' + Qdata[i].title + '</p></button>');
      }


      // イベントハンドラの追加
      $("#questionClose").on('click', NSF.fnQuestionSelectClose);
      $("#studySelect").on('click', NSF.fnstudySelect);
      $(".qusetion-load-button").on('click', NSF.fnloadSelect);
      // $("#study").off('click', NSF.fnstudy);
      // $("#save").off('click', NSF.fnsave);
      // $("#load").off('click', NSF.fnload);
      // $("#quit").off('click', NSF.fnquit);
    });
  }

  //quitボタンをクリック
  NSF.fnquit = function () {

    NSF.fnchangeMode();
    $('#mode_draw').prop('checked', true);
    $('.change_mode').removeClass('question');
    $('.change_mode').addClass('draw');

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/quit.json',
      // url: 'NewNetworkSimulator/php/push_quit.php',
      data:{id : NSF.urlparameter}
    }).done(function(Qdata) {

      console.log(Qdata);

      //取得したJSONをオブジェクトに戻す
      Qdata = JSON.parse(Qdata);

      console.log(Qdata);

      // GlayLayerを表示
      // questionLayerを表示
      $("#questionLayer").css({
        display: 'block',
      });
      $("#questionLayer").animate({
        top:    $("#nsf-main").offset().top,
        left:   $("#nsf-main").offset().left,
        height: $("#nsf-main").height(),
        width:  $("#nsf-main").width(),
      },500);

      $("#questionLayer").append('<img src="/assets/batu.png" id="questionClose">'+
          '<div id="glayStudyMenu">'+
          '<div id="studyMenuOutput">'+
          '</div>'+
          '</div>'
        );

      $('#questionLayer').append('<div class="points" align="center">points:' + Qdata[0].point + '</div>');

      $('#studyMenuOutput').append('<div id="item-list"><ul></ul></div>');

      for(i=1; i < Qdata.length; i++){
        $('#studyMenuOutput #item-list ul').append('<p class="quitText qtr' + Qdata[i].grade + '">' + Qdata[i].title + '</p>');
      }

      // イベントハンドラの追加
      $("#questionClose").on('click', NSF.fnQuestionSelectClose);


    }).fail(function(XMLHttpRequest, textStatus) {
      $("#nsf-console").append("<p>> エラーが発生しました</p>");
    }).always(function(){});


  }


  //Nodeの情報を表示
  NSF.IndicateNodeInfo = function () {

    var nodes = [];

    //nodeの情報を取得
    for(i = 0, num = 0; i < $("#nsf-main img").length; i++){
      element = $("#nsf-main img")[i];
      if ($(element).hasClass('send-node2') !== true && $(element).hasClass('get-node2') !== true) {
        nodes[num] = new Object();
        nodes[num].element = element;
        num++;
      }
    }

    for(i = 0; i < nodes.length; i++){
      info_height = 20;
      ddElements = $('#nsf-right dt:contains(' + nodes[i].element.alt + ') + dd').clone();
      pElements =  $('#nsf-right dt:contains(' + nodes[i].element.alt + ') + dd p').clone();

      if (nodes[i].element.alt.slice(0, 2) == 'PC') {
        info_height = 80;
        info_width = 170;
      }
      else {
        for(j=0; j < pElements.length; j++){
          if (pElements[j].className == 'rightInfo-IPSM') {
            info_height += 20;
          }
          else {
            info_height += 40;
          }
        }
        info_width = 170;
      }
      nodeX = nodes[i].element.x + 35 - NSF.mainCanvasX;
      nodeY = nodes[i].element.y + 35 - NSF.mainCanvasY;
      rightInfoX = $('#nsf-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetLeft;
      rightInfoY = $('#nsf-right dt:contains("' + nodes[i].element.alt + '") img')[0].offsetTop;


      $("#checkLayer").append(
        $('<div>').attr({
          class: 'info',
          style: 'position: absolute; top: ' + nodeY + 'px; left: ' + nodeX + 'px; width:' + info_width + 'px; height:' + info_height + 'px;'

        }));

      $("#checkLayer div:last-child").append("<p>" + nodes[i].element.alt + "</p>");
      $("#checkLayer div:last-child").append(ddElements)

    }
  }

  // nsf-main Fnction

  // 画像を追加
  NSF.fnMainDrop = function(ui, obj) {
    // 機種の判別
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      NSF.dropNodeInt = NSF.pcNode;
      NSF.dropNodeName = "PC"+ NSF.pcNode;
      NSF.dropContextName = "context-menu-PC";
      NSF.pcNode++;
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      NSF.dropNodeInt = NSF.ruNode;
      NSF.dropNodeName = "Router"+ NSF.ruNode;
      NSF.dropContextName = "context-menu-Router";
      NSF.ruNode++;
    }
    // nsf-mainに画像を追加 (clssとstyleの設定の追加)
    $("#nsf-main").append(
      $("<img>").attr({
      src: ui.draggable.attr("src"),
      alt: NSF.dropNodeName,
      class: NSF.dropContextName,
      'data-ifnum': 0,
      'data-lan-if': '',
      'data-routingtablenum':0,
      'data-linknum': 0,
      style: "position: absolute; top: "+ ui.offset.top +"px; left: "+ ui.offset.left +"px",
    }));
    $("#nsf-main img:last-child").attr('oncontextmenu', 'return fncontextmenu(this)');
    // nsf-mainの画像にdraggableを付ける
    $("#nsf-main img:last-child").draggable({
      containment: 'parent',
      zIndex: 2,
      // ドラッグ中
      drag: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().offset({
            top:  this.offsetTop - 15,
            left: this.offsetLeft + 42,
          });
          $(this).prev().css('zIndex', 3);
        }
      },
      // // ドラッグ終了
      stop: function(){
        if($(this).prev().hasClass("get-node2") || $(this).prev().hasClass("send-node2")){
          $(this).prev().css('zIndex', 1);
        }
      },
    });
    //context-menuに名前を追加
    //$(obj[0].lastChild).data().name = NSF.dropNodeName;
    // LANが ONのとき画像を動かなくする
    if($("#lan").attr("src") === "/assets/lanCable_2.png") {
      var elMainImgLast = $("#nsf-main img:last-child");
      elMainImgLast.css("cursor", "crosshair");
      elMainImgLast.mouseup(function(e) { e.preventDefault(); });
      elMainImgLast.mousedown(function(e) { e.preventDefault(); });
      elMainImgLast.mouseenter(function(){
        NSF.lanFlag = true;
        $(this).addClass("lanOn");
        $(this).draggable("disable");
      }).mouseleave(function(){
        NSF.lanFlag = false;
        $(this).removeClass("lanOn");
        $(this).draggable("enable");
      });
    }
    // nsf-rightにトポロジを追加
    if(ui.draggable.attr("src") === "/assets/pc.png") {
      $("#nsf-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NSF.dropNodeInt +"</span></dt>" +
      "<dd><p class='rightInfo-IPSM'>IP-0: <span id='rightInfo-IP" + NSF.dropNodeInt + "'></span> /<span id='rightInfo-SM" + NSF.dropNodeInt + "'></span></p></dd>");

      $('#nsf-right dt:contains("'+ ui.draggable.attr("alt") + NSF.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-PCroutingtable-IP' + NSF.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-PCroutingtable-SM' + NSF.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-PCroutingtable-NHA' + NSF.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-PCroutingtable-IF' + NSF.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    else if(ui.draggable.attr("src") === "/assets/router.png") {
      $("#nsf-right dl").append("<dt><img src= /assets/plus.jpg><span>"+ ui.draggable.attr("alt") + NSF.dropNodeInt +"</span></dt><dd><div class='rightInfo-IPSM'></div></dd>");

      $('#nsf-right dt:contains("'+ ui.draggable.attr("alt") + NSF.dropNodeInt +'") + dd')
      .append('<p class="rightInfo-routingtable-IPSM"><span id="rightInfo-routingtable-IP' + NSF.dropNodeInt + '_'  + '0' + '">DefaultGateway</span>/<span id="rightInfo-routingtable-SM' + NSF.dropNodeInt + '_'  + '0' +'"></span>' +
      '<br/>→<span id="rightInfo-routingtable-NHA' + NSF.dropNodeInt + '_'  + '0' + '"></span>：IF<span id="rightInfo-routingtable-IF' + NSF.dropNodeInt + '_'  + '0' + '"></span></p>');
    }
    // dd要素(IPとSM)を隠す
    $("#nsf-right dd:last").css("display","none");
    NSF.fnNameDraw(ui.draggable.attr('alt') + NSF.dropNodeInt);
  }


  // nsf-canvas Function

  // マウスのボタンが押されたときに処理を実行する関数
  NSF.fnLanDown = function(e) {
    // imgにマウスが乗っているとき
    if(NSF.lanFlag && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      // PCに線が引かれているとき
      if($(e.target).attr("src") === "/assets/pc.png" && $(e.target).hasClass("lanLink")) {
        $("#nsf-console").append("<p>> PCにLANは1本しか引けません。</p>");
      }
      else {
        // canvasの追加
        NSF.addCanvas = $('<canvas width="' + NSF.canvasWidth + '" height="' + NSF.canvasHeight + '"></canvas>').prependTo('#nsf-main');
        NSF.lanFlagPoint = true;
        // lanLinkがある場合
        if($(this).children(".lanOn").hasClass("lanLink")) {
          NSF.lanFlaglink = true;
        }
        // Classの追加
        $(this).children(".lanOn").addClass("lanFirst lanLink sP_"+ NSF.lanNode);
        //$('#nsf-main-canvas').addClass("L_"+ NSF.lanNode);
        // マウスを押した場所の座標
        NSF.points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
        //busから線を引いた時のフラグ
        if ($('.sP_' + NSF.lanNode).hasClass('bus')) {
          NSF.busFlag = true;
        }
        // 関数 lanDragの呼び出し
        $("#nsf-main").on("mousemove", NSF.fnLanDrag);
      }
    }
  }

  NSF.fnBusDown = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0 && $('.lanFirst').length == 0 && $('.bus-mouseover').length == 0) {
      NSF.points = [];
      NSF.addCanvas = $('<canvas width="' + NSF.canvasWidth + '" height="' + NSF.canvasHeight + '"></canvas>').prependTo('#nsf-main');
      $("#nsf-main").on("mousemove", NSF.fnBusDrag);
      $('#nsf-main').on('mouseup', NSF.fnBusUp);
      $("html").on("mouseup", NSF.fnBusOutUp);
      NSF.busDrawFrag = true;
    }
  }

  // マウスが移動したときに処理を実行する関数
  NSF.fnLanDrag = function(e) {
    NSF.addCtx = NSF.addCanvas.get(0).getContext('2d');
    NSF.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NSF.addCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
    NSF.addCtx.beginPath();
    // 線の色の変更
    if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn")) {
      NSF.addCtx.strokeStyle = '#2fb9fe';
    }
    else {
      NSF.addCtx.strokeStyle = '#fb9003';
    }
    NSF.addCtx.lineWidth = NSF.lanWidth;
    NSF.addCtx.moveTo(NSF.points[0].x, NSF.points[0].y);
    NSF.addCtx.lineTo(NSF.points[NSF.points.length - 1].x, NSF.points[NSF.points.length - 1].y);
    NSF.addCtx.stroke();
  }

  NSF.fnBusDrag = function (e) {
    NSF.addCtx = NSF.addCanvas.get(0).getContext('2d');
    NSF.points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
    NSF.addCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
    NSF.addCtx.beginPath();
    NSF.addCtx.strokeRect(NSF.points[0].x, NSF.points[0].y, NSF.points[NSF.points.length - 1].x - NSF.points[0].x, 10);
  }

  // マウスのボタンが離されたときに処理を実行する関数
  NSF.fnLanUp = function(e) {
    if(NSF.lanFlagPoint && $("#lan").attr("src") === "/assets/lanCable_2.png") {
      NSF.lanFlagDelet = true;
      // マウスを押してドラッグしなかったとき || 画像の上に載ってないとき || 最初の画像のとき
      if(NSF.points.length === 1 || (NSF.lanFlag === false) || $(e.target).hasClass("lanFirst")) {
          if(NSF.lanFlaglink === true) {
            $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
          }
          else {
            $(".sP_"+ NSF.lanNode).removeClass("lanLink sP_"+ NSF.lanNode);
          }
          $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
          NSF.lanFlagDelet = false;
          NSF.lanNode--;
      }
      else if (NSF.busFlag == true && $(e.target).hasClass('bus')) {
        $("#nsf-console").append("<p>> busとbusは繋げません</p>");
        if(NSF.lanFlaglink === true) {
          $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
        }
        else {
          $(".sP_"+ NSF.lanNode).removeClass("lanLink sP_"+ NSF.lanNode);
        }
        $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
        NSF.lanFlagDelet = false;
        NSF.lanNode--;
      }
      // PCにもう線が引かれているとき
      else if($(e.target).hasClass("lanLink") && $(e.target).attr("src") === "/assets/pc.png") {
        if(NSF.lanFlaglink === true) {
          $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
        }
        else {
          $(".sP_"+ NSF.lanNode).removeClass("lanLink sP_"+ NSF.lanNode);
        }
        $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
        $("#nsf-console").append("<p>> PCにLANは1本しか引けません。</p>");
        NSF.lanFlagDelet = false;
        NSF.lanNode--;
      }
      // 同じ場所に線を引かないようにする
      else {
        for(var i = 0; i < NSF.lanNode; i++) {
          if(($(".lanFirst").hasClass("sP_"+ i) && $(".lanOn").hasClass("eP_"+ i)) ||
             ($(".lanFirst").hasClass("eP_"+ i) && $(".lanOn").hasClass("sP_"+ i))) {
              $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
              $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
              $("#nsf-console").append("<p>> 同じ所にLANは引けません。</p>");
              NSF.lanFlagDelet = false;
              NSF.lanNode--;
              break;
          }
        }
      }

      // 画像の真ん中に線を持ってくる動作アンドモア
      if(!($(e.target).hasClass("lanFirst")) && $(e.target).hasClass("lanOn") && NSF.lanFlagDelet) {
        NSF.lanArrWidth[NSF.lanNode] = NSF.lanWidth;
        $(".lanOn").addClass("lanLink eP_"+ NSF.lanNode);

        // $('.sP_' + NSF.lanNode).addClass('Lan' + NSF.lanNode);
        // $('.eP_' + NSF.lanNode).addClass('Lan' + NSF.lanNode);

        $('#nsf-main-canvas').addClass("L_"+ NSF.lanNode);
        spifnum =  parseInt($('.sP_' + NSF.lanNode).attr('data-ifnum'));
        spifnum += 1;
        epifnum =  parseInt($('.eP_' + NSF.lanNode).attr('data-ifnum'));
        epifnum += 1;

        //buslanの追加
        if ($('.sP_' + NSF.lanNode).hasClass('bus') ||  $('.eP_' + NSF.lanNode).hasClass('bus')){
          if ($('#nsf-main-canvas').attr('data-buslan') == undefined) {
            $('#nsf-main-canvas').attr('data-buslan', 'B_' + NSF.lanNode);
          }
          else {
            tmp = $('#nsf-main-canvas').attr('data-buslan');
            tmp += ' ' + 'B_' + NSF.lanNode;
            $('#nsf-main-canvas').attr('data-buslan', tmp);
          }
        }

        //lanとifの結びつけ
        if ($('.sP_' + NSF.lanNode).hasClass('bus') == false) {
          if ($('.sP_' + NSF.lanNode).attr('data-lan-if') == '') {
            tmp =  $('.sP_' + NSF.lanNode).attr('data-lan-if');
            tmp += NSF.lanNode + '-' + $('.sP_' + NSF.lanNode).attr('data-ifnum');
            $('.sP_' + NSF.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.sP_' + NSF.lanNode).attr('data-lan-if') != '') {
            tmp =  $('.sP_' + NSF.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NSF.lanNode + '-' + $('.sP_' + NSF.lanNode).attr('data-ifnum');
            $('.sP_' + NSF.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.sP_' + NSF.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.sP_' + NSF.lanNode).attr('data-linknum', tmp);

        }
        if ($('.eP_' + NSF.lanNode).hasClass('bus') == false) {
          if ($('.eP_' + NSF.lanNode).attr('data-lan-if') == "") {
            tmp =  $('.eP_' + NSF.lanNode).attr('data-lan-if');
            tmp += NSF.lanNode + '-' + $('.eP_' + NSF.lanNode).attr('data-ifnum');
            $('.eP_' + NSF.lanNode).attr('data-lan-if', tmp);
          }
          else if ($('.eP_' + NSF.lanNode).attr('data-lan-if') != "") {
            tmp =  $('.eP_' + NSF.lanNode).attr('data-lan-if');
            tmp += ' ';
            tmp += NSF.lanNode + '-' + $('.eP_' + NSF.lanNode).attr('data-ifnum');
            $('.eP_' + NSF.lanNode).attr('data-lan-if', tmp);
          }
          tmp = $('.eP_' + NSF.lanNode).attr('data-linknum');
          tmp = parseInt(tmp) + 1;
          $('.eP_' + NSF.lanNode).attr('data-linknum', tmp);
        }


        //rightinfoに追加
        //router->router
        if ($('.sP_' + NSF.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NSF.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#nsf-right dl dt:contains("' + $('.sP_' + NSF.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NSF.lanNode).attr('data-ifnum',spifnum);

          $('#nsf-right dl dt:contains("' + $('.eP_' + NSF.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NSF.lanNode).attr('data-ifnum', epifnum);

        }

        //pc,bus->router
        if ($('.sP_' + NSF.lanNode).attr('alt').substr(0, 6) !== 'Router' && $('.eP_' + NSF.lanNode).attr('alt').substr(0, 6) === 'Router') {

          $('#nsf-right dl dt:contains("' + $('.eP_' + NSF.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.eP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.eP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.eP_' + NSF.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.eP_' + NSF.lanNode).attr('data-ifnum', epifnum);

        }

        //router->pc,bus
        if ($('.sP_' + NSF.lanNode).attr('alt').substr(0, 6) === 'Router' && $('.eP_' + NSF.lanNode).attr('alt').substr(0, 6) !== 'Router') {
          $('#nsf-right dl dt:contains("' + $('.sP_' + NSF.lanNode)[0].alt + '") + dd .rightInfo-IPSM:last')
          .after('<p class="rightInfo-IPSM"><span id="' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '" class="num">IP-' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '</span>: <span id="rightInfo-IP' + $('.sP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '"></span>/<span id="rightInfo-SM' +
          $('.sP_' + NSF.lanNode)[0].alt.slice(6) + '_' + $('.sP_' + NSF.lanNode).attr('data-ifnum') + '"></span></p>');
          $('.sP_' + NSF.lanNode).attr('data-ifnum',spifnum);
        }

        //描画
        NSF.fnIfDraw();
        NSF.fnLanDraw();
      }

      // 変数とフラグを設定
      NSF.lanNode++;
      NSF.points = [];
      NSF.lanFlaglink = false;
      NSF.lanFlagPoint = false;
      NSF.busFlag = false;
      NSF.addCanvas.remove();
      // イベントハンドラの削除
      $("#nsf-main").off("mousemove", NSF.lanDrag);
      $("#nsf-main .ui-draggable").removeClass("lanFirst");
    }
  }

  NSF.fnBusUp = function (e) {
    if($('#lan').attr('src') === '/assets/lanCable.png' && $('.mouseover').length == 0) {
      //始点と終点の位置
      if (NSF.points[NSF.points.length - 1].x - NSF.points[0].x > 0) {
        x = NSF.points[0].x + NSF.mainCanvasX;
        y = NSF.points[0].y + NSF.mainCanvasY;
        width = NSF.points[NSF.points.length - 1].x - NSF.points[0].x;
      }
      else {
        x = NSF.points[NSF.points.length - 1].x + NSF.mainCanvasX;
        y = NSF.points[0].y + NSF.mainCanvasY;
        width = NSF.points[0].x - NSF.points[NSF.points.length - 1].x;
      }

      //divを追加
      $('#nsf-main').append(
        $('<div>').attr({
          alt: 'bus' + NSF.busNode,
          class: 'bus',
          'data-bus': '',
          style: 'position: absolute; top: ' + y + 'px; left: '+  x +'px; width:' + width + 'px; height:10px;',
          'oncontextmenu': 'return busscontextmenu(this)'
        }));

      $('.bus').draggable({
        containment: 'parent',
        scroll: false,
      });

      $('.bus').on('drag', NSF.fnLanMoveDrag);

      NSF.points = [];
      NSF.busNode++;
      NSF.addCanvas.remove();
      NSF.busDrawFrag = false;
      // イベントハンドラの削除
      $('#nsf-main').off('mousemove', NSF.fnBusDrag);
      $('#nsf-main').off('mouseup', NSF.fnBusUp);
    }
  }

  // 線を引いてる途中 nsf-main以外でマウスを放した時
  NSF.fnLanOutUp = function(e) {
    if(NSF.lanFlagPoint) {
      NSF.addCanvas.remove();
      if(!(NSF.lanFlaglink)) {
        $(".sP_"+ NSF.lanNode).removeClass("lanLink");
      }
      $("#nsf-main").off("mousemove", NSF.fnLanDrag);
      $("#nsf-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
      $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
      // 変数とフラグをリセット
      NSF.points = [];
      NSF.lanFlaglink = false;
      NSF.lanFlagPoint = false;
    }
  }

  NSF.fnBusOutUp = function(e) {
    // NSF.addCanvas.remove();
    // $("#nsf-main").off("mousemove", NSF.fnBusDrag);
    // // 変数とフラグをリセット
    // NSF.points = [];
  }

  // マウスを押したとき (線を動かす動作)
  NSF.fnLanMoveDown = function(e) {
    // if($(e.target).hasClass("lanLink")) {
    //   NSF.elLanMoveThis = $(this);
    //   NSF.lanFlagMove = true;
    //   NSF.lanArrClass = $("#nsf-main-canvas").attr("class").split(/\s?L_/);
    //   NSF.elLanMoveThis.on("mousemove", NSF.fnLanMoveDrag);
    // }
    NSF.elLanMoveThis = $(this);
    NSF.lanFlagMove = true;
    NSF.lanArrClass = $("#nsf-main-canvas").attr("class").split(/\s?L_/);
    NSF.elLanMoveThis.on("mousemove", NSF.fnLanMoveDrag);
  }

  // ドラッグしている時 (線を動かす動作)
  NSF.fnLanMoveDrag = function(e) {
    NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
    NSF.fnDraw();
  }

  // マウスを放した時 (線を動かす動作)
  NSF.fnLanMoveUp = function(e) {
    if(NSF.lanFlagMove === true) {
      NSF.lanFlagMove = false;
      NSF.elLanMoveThis.off("mousemove", NSF.fnLanMoveDrag);
    }
  }

  // main以外でマウスを放した時 (線を動かす動作)
  // NSF.fnLanMoveOutUp = function(e) {
  //   if(NSF.lanFlagMove === true) {
  //     NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
  //     for(var i = 1; i < NSF.lanArrClass.length; i++) {
  //       //NSF.fnIfDraw(NSF.lanArrClass[i]);
  //       NSF.fnLanDraw(NSF.lanArrClass[i]);
  //      }
  //     NSF.lanFlagMove = false;
  //     NSF.elLanMoveThis.off("mousemove", NSF.fnLanMoveDrag);
  //   }
  // }


  //描画セット
  NSF.fnDraw = function () {
    NSF.fnIfDraw();
    NSF.fnLanDraw();
    NSF.fnNameDraw();
  }

  // 線の描画関数 (バス型要改良)
  NSF.fnLanDraw = function() {

    if ($('#nsf-main-canvas').attr('class') != '') {
      NSF.mainCtx.beginPath();
      lanNum = $('#nsf-main-canvas').attr('class').split(' ');
      for(i=0; i < lanNum.length; i++){
        lanNum[i] = lanNum[i].slice(2);
      }

      //先にbusにつながっているlan
      if ($('#nsf-main-canvas').attr('data-buslan') != undefined) {
        busLanNum = $('#nsf-main-canvas').attr('data-buslan').split(' ');
        for(i=0; i < busLanNum.length; i++){
          busLanNum[i] = busLanNum[i].slice(2);
        }
      }
      else {
        busLanNum = '';
      }


      tmp = new Object();

      //busの数だけ描画
      if (busLanNum != '') {
        $('.bus').each(function (i, e){
          bus = new Object();
          bus.element = e;
          bus.x = e.offsetLeft + e.offsetWidth / 2;
          bus.y = e.offsetTop + e.offsetHeight / 2;
          nodes = [];

          //バスがいくつのノードとつながっているか
          for(j=0, count=0; j < busLanNum.length; j++){
            if ($(e).hasClass('sP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.eP_' + busLanNum[j]);
              nodes[count].x = $('.eP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.eP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
            else if ($(e).hasClass('eP_' + busLanNum[j])) {
              nodes[count] = new Object();
              nodes[count].element = $('.sP_' + busLanNum[j]);
              nodes[count].x = $('.sP_' + busLanNum[j])[0].x;
              nodes[count].y = $('.sP_' + busLanNum[j])[0].y;
              count++;
              for(k=0; k < lanNum.length; k++){
                if (lanNum[k] == busLanNum[j]) {
                  lanNum.splice(k, 1);
                  k--;
                }
              }
            }
          }

          //バスの線より上か下か
          nodeUp = [];
          nodeDown = [];
          for(j=0, upCount=0, downCount=0; j < nodes.length; j++){
            if (bus.y - nodes[j].y >= 0) {
              nodeUp[upCount] = new Object();
              nodeUp[upCount] = nodes[j];
              upCount++;
            }
            else {
              nodeDown[downCount] = new Object();
              nodeDown[downCount] = nodes[j];
              downCount++;
            }
          }

          //右順にノードを並び替える
          for(j=0; j < nodes.length; j++){
            for(k=j+1; k < nodes.length; k++){
              if (nodes[j].x < nodes[k].x) {
                tmp = nodes[j];
                nodes[j] = nodes[k];
                nodes[k] = tmp;
              }
            }
          }

          //縦の線を描画
          for(j=0; j < nodes.length; j++){
            NSF.mainCtx.moveTo(nodes[j].x - NSF.mainCanvasWidth, nodes[j].y - NSF.mainCanvasHeight);
            NSF.mainCtx.lineTo(nodes[j].x - NSF.mainCanvasWidth, bus.y - NSF.mainCanvasY);
            NSF.mainCtx.stroke();
          }

          //divを変形させる
          if (nodes.length > 1) {
            $(e).css({
              'left': nodes[nodes.length-1].x,
              'width': nodes[0].x - nodes[nodes.length-1].x + 70,
           });
          }
          else if(nodes.length == 1){
            $(e).css({
              'left': nodes[0].x,
              'width': 70,
           });
          }
        });
      }

      //node-to-nodeの描画
      for(i=0; i < lanNum.length; i++){
        NSF.mainCtx.beginPath();
        NSF.mainCtx.moveTo($(".sP_"+ lanNum[i])[0].offsetLeft - NSF.mainCanvasWidth, $(".sP_"+ lanNum[i])[0].offsetTop - NSF.mainCanvasHeight);
        NSF.mainCtx.lineTo($(".eP_"+ lanNum[i])[0].offsetLeft - NSF.mainCanvasWidth, $(".eP_"+ lanNum[i])[0].offsetTop - NSF.mainCanvasHeight);
        NSF.mainCtx.stroke();
      }
    }

  }

  //ifをcanvasに描画
  NSF.fnIfDraw = function () {

    NSF.mainCtx.beginPath();
    ctx = document.getElementById('nsf-main-canvas').getContext('2d');

    lanClass =  $('#nsf-main-canvas').attr('class').split(/\s?L_/);

    for(lanClassNum=1; lanClassNum < lanClass.length; lanClassNum++){
      lanNum = lanClass[lanClassNum];

      //sPがbusでない
      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        spSplit = $('.sP_' + lanNum).attr('data-lan-if').split(' ');
        spLanIf = [];
        for(i=0; i < spSplit.length; i++){
          spLanIf[i] = spSplit[i].split('-')
        }
        for(i=0; i < spLanIf.length; i++){
          if (spLanIf[i][0] == lanNum) {
            spIf = 'if' + spLanIf[i][1];
          }
        }
        spX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth;
        spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        spType = $('.sP_' + lanNum).attr('alt').substr(0, 6);
      }
      //sPがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) > $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        }
        //busが下
        else {
          spX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth + 25;
          spY = $('.sP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        }
        spIf = ''
      }

      //ePがbusでない
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        epSplit = $('.eP_' + lanNum).attr('data-lan-if').split(' ');
        epLanIf = [];
        for(i=0; i < epSplit.length; i++){
          epLanIf[i] = epSplit[i].split('-')
        }
        for(i=0; i < epLanIf.length; i++){
          if (epLanIf[i][0] == lanNum) {
            epIf = 'if' + epLanIf[i][1];
          }
        }
        epX = $('.eP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth;
        epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        epType = $('.eP_' + lanNum).attr('alt').substr(0, 6);
      }
      //ePがbus
      else {
        //busが上
        if ($('.eP_' + lanNum)[0].style.top.slice(0, -2) < $('.sP_' + lanNum)[0].style.top.slice(0, -2)) {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        }
        //busが下
        else {
          epX = $('.sP_' + lanNum)[0].style.left.slice(0, -2) - NSF.mainCanvasWidth + 25;
          epY = $('.eP_' + lanNum)[0].style.top.slice(0, -2) - NSF.mainCanvasHeight;
        }
        epIf = ''
      }

      if ($('.sP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(spX, spY, epX, epY, spType, spIf);
      }
      if ($('.eP_' + lanNum).attr('data-lan-if') != undefined) {
        ifDraw(epX, epY, spX, spY, epType, epIf);
      }
    }

    ifDraw = function(aX, aY, bX, bY, type, ifname) {
      if (type === 'Router') {
        //楕円と直線の交点を求める
        var s = 50;
        var t = 30;
        var a = (bY-aY) / (bX-aX);
        var x = Math.sqrt((s*s * t*t) / (t*t + a*a * s*s));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }

      }
      else {
        //円と直線の交点を求める
        var a = (bY-aY) / (bX-aX);
        var r = 50;
        var x = Math.sqrt(r*r / (1+a*a));
        var y = a * x;

        if (bX-aX > 0) {
          x = x + aX;
          y = y + aY;
          ctx.fillText(ifname, x, y, 200);
        }
        else {
          x = aX - x;
          y = aY - y;
          ctx.fillText(ifname, x, y, 200);
        }
      }
    }
  }


  //ノードの名前を表示
  NSF.fnNameDraw = function () {
    NSF.mainCtx.beginPath();
    ctx = document.getElementById('nsf-main-canvas').getContext('2d');
    $('#nsf-main img').each(function (i, e) {
      if ($(e).attr('id') != 'questionClose') {
        if ($(e)[0].alt.slice(0, 2) == 'PC') {
          drawName = $(e)[0].alt;
          x = $('#nsf-main img[alt="' + $(e)[0].alt + '"]')[0].x - NSF.mainCanvasWidth - 10;
          y = $('#nsf-main img[alt="' + $(e)[0].alt + '"]')[0].y - NSF.mainCanvasHeight - 35;
          ctx.fillText(drawName, x, y, 200);
        }
        else if ($(e)[0].alt.slice(0, 2) == 'Ro'){
          drawName = 'Ro' + $(e)[0].alt.slice(6);
          x = $('#nsf-main img[alt="' + $(e)[0].alt + '"]')[0].x - NSF.mainCanvasWidth - 10;
          y = $('#nsf-main img[alt="' + $(e)[0].alt + '"]')[0].y - NSF.mainCanvasHeight - 20;
          ctx.fillText(drawName, x, y, 200);
        }
      }
    });
  }


  // nsf-etc Fnction

  // contextMenuのcallback関数 (PC Router)
  NSF.fnConfunc = function(key, opt) {
    // 削除を押した時の動作
    if(key === "del") {
      NSF.lanArrClass = $("#nsf-main-canvas").attr("class").split(/\s?L_/);
      NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
      for(var i = 1; i < NSF.lanArrClass.length; i++) {
        if(this.hasClass("sP_"+ NSF.lanArrClass[i]))　{
          $("#nsf-main img").removeClass("eP_"+ NSF.lanArrClass[i]);
          $("#nsf-main-canvas").removeClass("L_"+ NSF.lanArrClass[i]);
          $("#nsf-main img").removeClass("if_"+ NSF.lanArrClass[i]);
        }
        else if(this.hasClass("eP_"+ NSF.lanArrClass[i])) {
          $("#nsf-main img").removeClass("sP_"+ NSF.lanArrClass[i]);
          $("#nsf-main-canvas").removeClass("L_"+ NSF.lanArrClass[i]);
          $("#nsf-main img").removeClass("if_"+ NSF.lanArrClass[i]);
        }
        else {
          NSF.fnLanDraw(NSF.lanArrClass[i]);
        }
      }
      if($(this).hasClass("get-node") || $(this).hasClass("send-node")) {
        $(this).prev().remove();
      }
      $(this).remove();
      $("#nsf-main img:not([class*='P_'])").removeClass("lanLink");
      $("#nsf-right dt:contains('"+ opt.$trigger[0].alt +"'), #nsf-right dt:contains('"+ opt.$trigger[0].alt +"') + dd").remove();
      // lanLinkがないとき
      if(!($("#nsf-main .ui-draggable").hasClass("lanLink"))) {
        $("#nsf-main").off("mousedown", NSF.fnLanMoveDown);
        $("#nsf-main").off("mouseup", NSF.fnLanMoveUp);
        $("html").off("mouseup", NSF.fnLanMoveOutUp);
      }
    }
  }



  // イベントの定義


  // window

  // ブラウザをリサイズ
  $(window).resize(function(){
    $('html').scrollTop(0);
    $('html').scrollLeft(0);
    var loadWidth        = $('#nsf-main-canvas')[0].getBoundingClientRect().left - 35;
    var loadHeight       = $('#nsf-main-canvas')[0].getBoundingClientRect().top - 35;
    var calCanvasWidth   = loadWidth - NSF.mainCanvasWidth;
    var calCanvasHeight  = loadHeight - NSF.mainCanvasHeight;
    NSF.mainCanvasWidth  = loadWidth;
    NSF.mainCanvasHeight = loadHeight;
    $("#nsf-main img").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#nsf-main .bus").each(function(i, val){
      $(val).offset({
        left:$(val).offset().left += calCanvasWidth,
        top:$(val).offset().top += calCanvasHeight
      });
    });
    $("#glayLayer").css({
      'top': $("#nsf-container").offset().top,
      'left': $("#nsf-container").offset().left,
    });
    // bGlayFlag
    if(NSF.bGlayFladg) {
      $("#glayLayer").css({
        'top':   $("#nsf-container").offset().top,
        'left':  $("#nsf-container").offset().left,
      });
    }
  });

  // GlayLayerの座標の指定 (New)
  $("#glayLayer").css({
    'top': $("#nsf-container").offset().top,
    'left': $("#nsf-container").offset().left,
    'width':  $("#nsf-container").width() - 4,
  });

  //checkLayerの指定
  $("#checkLayer").css({
    'top': $("#nsf-main").offset().top,
    'left': $("#nsf-main").offset().left,
    'width':  $("#nsf-main").width()
  });

  //questionLayerの指定
  $('#questionLayer').css({
    'top': $("#nsf-main").offset().top,
    'left': $("#nsf-main").offset().left,
    'width':  $("#nsf-main").width()
  });

  // //読み込み時のアニメーション
  // $().introtzikas({
  //   line: '#fff', //ラインの色
  //   speedwidth: 1000, //幅の移動完了スピード
  //   speedheight: 1000, //高さの移動完了スピード
  //   bg: '#333' //背景色
  // });




  // nsf-nav

  // Dustをクリック
  $("#dust").on('click', NSF.fnAllReset);

  //startをクリック
  $("#connect-start").click(function(){

    //変数宣言
    if ( typeof NSFCS === "undefined" ) var NSFCS = {};

      //コンストラクタのようなもの
      function router_const(){
        this.name = "";
        this.ip = [];
        this.sm = [];
        this.routingtable = [];
      }

      function pc_const(){
        this.name = "";
        this.ip = "";
        this.sm = "";
        this.link = "";
      }

    if ($('#nsf-main img').hasClass('lanLink')) {

      router = []
      pc = []
      bus = []
      pc_num = 0
      sendData = new Object();

      //busのlanを取得
      if ($('#nsf-main-canvas').attr('data-buslan') != undefined) {
        busLan = $('#nsf-main-canvas').attr('data-buslan').split(' ');
      }
      else {
        busLan = '';
      }

      for (i=0; i < busLan.length; i++) {
        busLan[i] = busLan[i].slice(2);
      }

      //right-infoから情報回収
      //routerのname, ip, sm, nhaを取得
      $('#nsf-right dt:contains("Router") span:nth-of-type(1)').each(function(i, e){
        router[i] = new router_const();
        router[i].name = $(e).text();
      });

      //ip&sm
      for(i=0; i < router.length; i++){
        count = 0;
        $('#nsf-right dt:contains("' + router[i].name + '") + dd p[class="rightInfo-IPSM"] span').each(function(j, e) {
          if (j % 3 === 1) {
            router[i].ip[count] = $(e).text();
          }
          else if (j % 3 === 2){
            router[i].sm[count] = calculation_sm($(e).text());
            count++;
          }
        });
      }

      //ルーティングテーブルの数だけ生成
      for(i=0; i < router.length; i++){
        router[i].routingtable = [];
        count = 0;
        router[i].routingtable[count] = new Object();
        $('#nsf-right dt:contains("' + router[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            router[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            router[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            router[i].routingtable[count].nha = e.textContent;
          }
          else {
            router[i].routingtable[count].if = e.textContent;
            count += 1;
            router[i].routingtable[count] = new Object();
          }
        });
        router[i].routingtable.pop();
      }



      //pcのname, ip, smを取得
      $("#nsf-right dt:contains('PC') span:nth-of-type(1)").each(function(i, e){
        pc[i] = new pc_const();
        pc[i].name = $(e).text();
        pc_num++;
      });

      count = 0;
      $("#nsf-right dt:contains('PC') + dd .rightInfo-IPSM span").each(function(i, e) {
        if (i % 2 === 0) {
          pc[count].ip = $(e).text();
        }
        else {
          pc[count].sm = calculation_sm($(e).text());
          count += 1;
        }
      });

      //ルーティングテーブルの数だけ生成
      for(i=0; i < pc.length; i++){
        pc[i].routingtable = [];
        count = 0;
        pc[i].routingtable[count] = new Object();
        $('#nsf-right dt:contains("' + pc[i].name + '") + dd .rightInfo-routingtable-IPSM span').each(function (j, e) {
          if (j % 4 == 0) {
            pc[i].routingtable[count].ip = e.textContent;
          }
          else if (j % 4 == 1) {
            pc[i].routingtable[count].sm = e.textContent;
          }
          else if (j % 4 == 2) {
            pc[i].routingtable[count].nha = e.textContent;
          }
          else {
            pc[i].routingtable[count].if = e.textContent;
            count += 1;
            pc[i].routingtable[count] = new Object();
          }
        });
        pc[i].routingtable.pop();
      }

      //busの情報を取得
      $('#nsf-main .bus').each(function (i, e) {
        bus[i] = new Object();
        bus[i].name = $(e).attr('alt');
      });

      //smの計算
      function calculation_sm(sm) {
        if (sm == '' || sm == 'none') {
          return '';
        }
        else {
          tmp = '';
          for(l = 0; l < 4; l++){
            split_sm = '';
            for(m = 0; m < 8; m++){
              if(sm > 0){
                split_sm += '1';
                sm--;
              }
              else{
                split_sm += '0';
              }
            }
            tmp += parseInt(split_sm, 2);
            if (l != 3) {
              tmp += '.';
            }
          }
          return tmp;
        }
      }

      //routerのlink
      for(i=0; i < router.length; i++){
        router[i].link = [];
        $('#nsf-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < router[i].ip.length; k++){
            router[i].link[k] = [];
            for(l=0; l < dataLanIf.length; l++){
              if (k == dataLanIf[l][2]) {
                if ($(e).hasClass('sP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.eP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.eP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[l][0])) {
                  router[i].link[k][0] = $('.sP_' + dataLanIf[l][0])[0].alt;
                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[l][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[l][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[l][0]) {
                        router[i].link[k][1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].link[k] = $('.sP_' + dataLanIf[l][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのlink
      for(i=0; i < pc.length; i++){
        $('#nsf-main img[alt="' + pc[i].name + '"]').each(function (j, e) {
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
              }
            }
            else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
              pc[i].link = [];
              pc[i].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

              //ノードの先のifを知る
              if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                for(m=0; m < dataLanIf2.length; m++){
                  dataLanIf2[m] = dataLanIf2[m].split('-');
                  if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                    pc[i].link[1] = dataLanIf2[m][1];
                  }
                }
              }
              else {
                pc[i].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
              }
            }
          }
        });
      }

      //pcのroutingtableのlink
      for(i=0; i < pc.length; i++){
        $('#nsf-main img[alt="' + pc[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < pc[i].routingtable.length; l++){
              if (pc[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  pc[i].routingtable[l].link = [];
                  pc[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        pc[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    pc[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //routerのroutingtableのlink
      for(i=0; i < router.length; i++){
        $('#nsf-main img[alt="' + router[i].name + '"]').each(function (j, e){
          dataLanIf = $(e).attr('data-lan-if').split(' ');
          for(k=0; k < dataLanIf.length; k++){
            dataLanIf[k] = dataLanIf[k].split('-');
            for(l=0; l < router[i].routingtable.length; l++){
              if (router[i].routingtable[l].if == dataLanIf[k][1]) {
                if ($(e).hasClass('sP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.eP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.eP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.eP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.eP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
                else if ($(e).hasClass('eP_' + dataLanIf[k][0])) {
                  router[i].routingtable[l].link = [];
                  router[i].routingtable[l].link[0] = $('.sP_' + dataLanIf[k][0])[0].alt;

                  //ノードの先のifを知る
                  if ($('.sP_' + dataLanIf[k][0]).hasClass('bus') == false) {
                    dataLanIf2 = $('.sP_' + dataLanIf[k][0]).attr('data-lan-if').split(' ');
                    for(m=0; m < dataLanIf2.length; m++){
                      dataLanIf2[m] = dataLanIf2[m].split('-');
                      if (dataLanIf2[m][0] == dataLanIf[k][0]) {
                        router[i].routingtable[l].link[1] = dataLanIf2[m][1];
                      }
                    }
                  }
                  else {
                    router[i].routingtable[l].link = $('.sP_' + dataLanIf[k][0]).attr('alt');
                  }
                }
              }
            }
          }
        });
      }

      //pcのルーティングテーブルのifが空の場合の処理
      for(i=0; i < pc.length; i++){
        for(j=0; j < pc[i].routingtable.length; j++){
          if (pc[i].routingtable[j].if == '') {
            pc[i].routingtable[j].link = [];
            pc[i].routingtable[j].link[0] = '';
            pc[i].routingtable[j].link[1] = '';
          }
        }
      }

      //routerのルーティングテーブルのifがからの場合の処理
      for(i=0; i < router.length; i++){
        for(j=0; j < router[i].routingtable.length; j++){
          if (router[i].routingtable[j].if == '') {
            router[i].routingtable[j].link = [];
            router[i].routingtable[j].link[0] = '';
            router[i].routingtable[j].link[1] = '';
          }
        }
      }



      //busのリンク
      for(i=0; i < bus.length; i++){
        bus[i].nodes = [];
        count = 0;
        for(j=0; j < busLan.length; j++){
          if ($('#nsf-main div[alt=' + bus[i].name + ']').hasClass('sP_' + busLan[j])) {
            bus[i].nodes[count] = $('.eP_' + busLan[j]).attr('alt');
            count++;
          }
          else if ($('#nsf-main div[alt=' + bus[i].name + ']').hasClass('eP_' + busLan[j])) {
            bus[i].nodes[count] = $('.sP_' + busLan[j]).attr('alt');
            count++;
          }
        }
      }

      console.log(pc);
      console.log(router);
      console.log(bus);

      sendData.pc_num = pc_num;

      //nodeInfo
      sendData.nodeInfo = [];

      //PCの情報
      for(i=0, j=0; i < pc.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = pc[i].name;
        sendData.nodeInfo[i].ip = pc[i].ip;
        sendData.nodeInfo[i].sm = pc[i].sm
        sendData.nodeInfo[i].link = pc[i].link;
        sendData.nodeInfo[i].routingtable = [];
        for(k=0; k < pc[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = pc[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(pc[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = pc[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = pc[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = pc[j].routingtable[k].link;
        }
      }

      //Routerの情報
      for(i=pc.length, j=0; j < router.length; i++, j++){
        sendData.nodeInfo[i] = new Object();
        sendData.nodeInfo[i].name = router[j].name;
        sendData.nodeInfo[i].ip = router[j].ip;
        sendData.nodeInfo[i].sm = router[j].sm;
        sendData.nodeInfo[i].routingtable = [];
        sendData.nodeInfo[i].link = router[j].link;
        for(k=0; k < router[j].routingtable.length; k++){
          sendData.nodeInfo[i].routingtable[k] = new Object();
          sendData.nodeInfo[i].routingtable[k].ip = router[j].routingtable[k].ip;
          sendData.nodeInfo[i].routingtable[k].sm = calculation_sm(router[j].routingtable[k].sm);
          sendData.nodeInfo[i].routingtable[k].nha = router[j].routingtable[k].nha;
          sendData.nodeInfo[i].routingtable[k].if = router[j].routingtable[k].if;
          sendData.nodeInfo[i].routingtable[k].link = router[j].routingtable[k].link;
        }
      }

      //busの情報
      sendData.busInfo = bus;


      console.log(sendData);

      JsonSendData = JSON.stringify(sendData, null, ' ');
      // JsonSendData = JSON.stringify(sendData);
      console.log(JsonSendData);


      //questionモードのとき
      if ($('.question').length > 0) {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: 'js/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#nsf-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#nsf-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            //正誤をデータベースに送信
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/push_start.php',
              url: 'js/result.json',
              data: {postData : 1, id : NSF.urlparameter, question_id : $('#question span').innerHTML}
            });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#nsf-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
            $.ajax({
              type: 'POST',
              dataType: 'text',
              // url: 'NewNetworkSimulator/php/pust_start.php',
              url: 'js/result.json',
              data: {postData : 0, id : NSF.urlparameter, question_id : $('#question span').innerHTML}
            });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#nsf-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#nsf-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }
      else {
        $.ajax({
          type: 'POST',
          dataType: 'text',
          // url: 'NewNetworkSimulator/php/post_networkdata.php',
          url: 'js/result.json',
          data: {postJsonData : NSFCS.JSONpostData}
        }).done(function (data) {
          resultData = JSON.parse(data);
          console.log(resultData);
          $("#nsf-console").append("<p>>result･･･</p>");

          //間違いがない=true, 間違いがある=false
          correctFlag = true;

          //間違いがあるかないか
          for(i=0; i < resultData.length; i++){
            if (resultData[i][resultData[i].length-1] == 0) {
              correctFlag = false;
            }
          }

          //間違いがない場合
          if (correctFlag == true) {
            $("#nsf-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_circle.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }
          //間違いがある場合
          else {
            //circleと同じアニメーション
            $("#nsf-main").append(
              $("<div>").attr({
                class: "cssCircle",
                style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
              }));
            $('.cssCircle:last-child').append(
              $('<img>').attr({
                src: '/assets/big_cross.png'
              }));
              $('.cssCircle').fadeOut(300,function(){
                $(this).fadeIn(400, function () {
                  $(this).fadeOut(200, function () {
                    $('.cssCircle').remove();
                  })
                })
              });
          }


          //resultをコンソールに出力
          for(i=0; i < resultData.length; i++){
            outputData = '';
            classData = '';
            for(j=0; j < resultData[i].length-1; j++){
              outputData += resultData[i][j];
              classData += resultData[i][j];
              if (j != resultData[i].length-2) {
                outputData += '->';
                classData += '-';
              }
            }
            if (resultData[i][j] == '1') {
              outputData += '：succses';
              classData += '-1';
            }
            if (resultData[i][j] == '0') {
              outputData += '：error';
              classData += '-0';
            }
            $('#nsf-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
          }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(errorThrown);
          console.log(textStatus);
          $("#nsf-console").append("<p>> エラーが発生したので処理を終了します。</p>");
        });
      }

      // $.ajax({
      //   type: 'POST',
      //   dataType: 'text',
      //   // url: 'NewNetworkSimulator/php/post_networkdata.php',
      //   url: 'js/result.json',
      //   data: {postJsonData : NSFCS.JSONpostData}
      // }).done(function (data) {
      //   resultData = JSON.parse(data);
      //   console.log(resultData);
      //   $("#nsf-console").append("<p>>result･･･</p>");
      //
      //   //間違いがない=true, 間違いがある=false
      //   correctFlag = true;
      //
      //   //間違いがあるかないか
      //   for(i=0; i < resultData.length; i++){
      //     if (resultData[i][resultData[i].length-1] == 0) {
      //       correctFlag = false;
      //     }
      //   }
      //
      //   //間違いがない場合
      //   if (correctFlag == true) {
      //     $("#nsf-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_circle.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     //正誤をデータベースに送信
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/push_start.php',
      //       url: 'js/result.json',
      //       data: {postData : 1, id : NSF.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //   //間違いがある場合
      //   else {
      //     //circleと同じアニメーション
      //     $("#nsf-main").append(
      //       $("<div>").attr({
      //         class: "cssCircle",
      //         style: "position: absolute; top: " + NSF.questionCanvasY + "px; left: "+ NSF.questionCanvasX + "px;" + NSF.canvasWidth + "; height:" + NSF.canvasHeight + ";"
      //       }));
      //     $('.cssCircle:last-child').append(
      //       $('<img>').attr({
      //         src: '/assets/big_cross.png'
      //       }));
      //       $('.cssCircle').fadeOut(300,function(){
      //         $(this).fadeIn(400, function () {
      //           $(this).fadeOut(200, function () {
      //             $('.cssCircle').remove();
      //           })
      //         })
      //       });
      //     $.ajax({
      //       type: 'POST',
      //       dataType: 'text',
      //       // url: 'NewNetworkSimulator/php/pust_start.php',
      //       url: 'js/result.json',
      //       data: {postData : 0, id : NSF.urlparameter, question_id : $('#question span').innerHTML}
      //     });
      //   }
      //
      //
      //   //resultをコンソールに出力
      //   for(i=0; i < resultData.length; i++){
      //     outputData = '';
      //     classData = '';
      //     for(j=0; j < resultData[i].length-1; j++){
      //       outputData += resultData[i][j];
      //       classData += resultData[i][j];
      //       if (j != resultData[i].length-2) {
      //         outputData += '->';
      //         classData += '-';
      //       }
      //     }
      //     if (resultData[i][j] == '1') {
      //       outputData += '：succses';
      //       classData += '-1';
      //     }
      //     if (resultData[i][j] == '0') {
      //       outputData += '：error';
      //       classData += '-0';
      //     }
      //     $('#nsf-console').append('<p id="console-text" class="' + classData + '" onClick="return packetAnimation(this);">>' + outputData +  '</p>');
      //   }
      // }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      //   console.log(errorThrown);
      //   console.log(textStatus);
      //   $("#nsf-console").append("<p>> エラーが発生したので処理を終了します。</p>");
      // });

    }
  });


  //Modeをクリック
  $('.mode_draw').click(function () {
    if ($('.change_mode').hasClass('question')) {
      NSF.fnchangeMode();
      $('.change_mode').removeClass('question');
      $('.change_mode').addClass('draw');
    }
  });

  $('.mode_question').click(function () {
    if ($('.change_mode').hasClass('draw')) {
      NSF.fnchangeMode();
      $('.change_mode').removeClass('draw');
      $('.change_mode').addClass('question');
    }
  });

  //checkをクリック
  $("#check").on(({
    mousedown:function () {

      //onのとき
      if ($('#check').attr('src') == '/assets/check_2.png') {
        //画像をoffに変更
        $('#check').attr('src', '/assets/check.png');
        //checkLayerを閉じる
        $("#checkLayer").css({'display':'none','height':0});
        $("#checkLayer").empty();
      }
      else {
        //画像を変更
        $("#check").attr("src", "/assets/check_2.png");
        //checkLayerを表示
        $("#checkLayer").css({
          display: 'block',
        });
        $("#checkLayer").animate({
          top:    $("#nsf-main").offset().top,
          left:   $("#nsf-main").offset().left,
          height: $("#nsf-main").height(),
          width:  $("#nsf-main").width(),
        },{
          duration:400,
          complete:function () {
            $("#checkLayer").append('<canvas width="600" height="400" id="checkLayer-canvas"></canvas>');
            $("#nsf-right dd").show();
            $("#nsf-right dt img").attr("src", "/assets/minus.jpg");
            NSF.IndicateNodeInfo();
          }
        });
      }
    }
    //,

    // mouseup:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // },

    // mouseleave:function () {
    //   //画像を変更
    //   $("#check").attr("src", "/assets/check.png");
    //   //checkLayerを閉じる
    //   $("#checkLayer").css({'display':'none','height':0});
    //   $("#checkLayer").empty();
    // }
  }));


  // Helpをクリック (Update)
  $("#info").click(function(){
    // GlayLayerを表示
    NSF.fnGlayOpen();
    // 画像等の追加
    $("#glayLayer").append('<div id="slideGalley"><ul id="slideUl">'+
      '<li><img src="/assets/sample1.png"></li><li><img src="/assets/sample2.png"></li><li><img src="/assets/sample3.png"></li><li><img src="/assets/sample4.png"></li><li><img src="/assets/sample5.png"></li><li><img src="/assets/sample6.png"></li><li><img src="/assets/sample7.png"></li><li><img src="/assets/sample8.png"></li>'+
      '</ul></div>');
    $("#glayLayer").append('<img src="/assets/batu.png" id="glayClose">');
    $("#glayLayer").append('<img src="/assets/left.png" id="infoLeft">');
    $("#glayLayer").append('<img src="/assets/right.png" id="infoRight">');
    // イベントハンドラの追加
    $("#infoLeft").on('click', NSF.fnGlayInfoLeft);
    $("#infoRight").on('click', NSF.fnGlayInfoRight);
    $("#glayClose").on('click', NSF.fnAllGlayClose);
  });

  // Debugをクリック
  $("#cui").click(function(){
    $("#nsf-console").append("<p>> デバックしました。</p>");
  });


  //問題ボタンの押した時
  $('.qusetion-select-button').click(function () {
  });


  // nsf-left

  // machineryをドラッグ
  $(".machinery").draggable({
    helper: 'clone',  // 要素を複製する
    revert: true,     // ドラッグ終了時に要素に戻る
    zIndex: 3,
    // ドラッグ開始
    start: function(e, ui) { $(this).addClass('dragout'); },
    // ドラッグ終了
    stop: function(e, ui) { $(this).removeClass('dragout'); },
  });

  // lanをクリック
  $("#lan").click(function(){
    NSF.changeLanMode();
  });

  //lanボタンをクリック（なぜか反応しない）
  // $('input[name=lanSwitch]').click(function(){
  //   console.log('a');
  //   var elHtml     = $("html");
  //   var elMain     = $("#nsf-main");
  //   var elMainDrag = $("#nsf-main .ui-draggable");
  //
  //   if ($('input[name=lanSwitch]').hasClass('lanDrawOn')) {
  //     // イベントハンドラーの削除
  //     elMain.off("mousedown", NSF.fnLanDown);
  //     elMain.off("mouseup", NSF.fnLanUp);
  //     elHtml.off("mouseup", NSF.fnLanOutUp);
  //     elMainDrag.off("mouseenter").off("mouseleave");
  //     // カーソルの変更
  //     elMain.css("cursor", "auto");
  //     elMainDrag.css("cursor", "pointer");
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.on("mousedown", NSF.fnLanMoveDown);
  //       elMain.on("mouseup", NSF.fnLanMoveUp);
  //       elHtml.on("mouseup", NSF.fnLanMoveOutUp);
  //     }
  //
  //     $("input[name=busSwitch]").removeClass('lanDrawOn');
  //   }
  //   else {
  //     // イベントハンドラーを付ける
  //     elMain.on("mousedown", NSF.fnLanDown);
  //     elMain.on("mouseup", NSF.fnLanUp);
  //     elHtml.on("mouseup", NSF.fnLanOutUp);
  //     // lanLinkがある時
  //     if(elMainDrag.hasClass("lanLink")) {
  //       elMain.off("mousedown", NSF.fnLanMoveDown);
  //       elMain.off("mouseup", NSF.fnLanMoveUp);
  //       elHtml.off("mouseup", NSF.fnLanMoveOutUp);
  //     }
  //     // カーソルの変更
  //     elMain.css("cursor", "crosshair");
  //     elMainDrag.css("cursor", "crosshair");
  //     // 画像のドラッグ防止
  //     elMainDrag.mouseup(function(e) { e.preventDefault(); });
  //     elMainDrag.mousedown(function(e) { e.preventDefault(); });
  //     // 画像にマウスが乗った時の動作
  //     elMainDrag.mouseenter(function(){
  //       // フラグの設定
  //       NSF.lanFlag = true;
  //       $(this).addClass("lanOn");
  //       $(this).draggable("disable");
  //     }).mouseleave(function(){
  //       // フラグの設定
  //       NSF.lanFlag = false;
  //       $(this).removeClass("lanOn");
  //       $(this).draggable("enable");
  //     });
  //     $("input[name=lanSwitch]").addClass('lanDrawOn');
  //   }
  // });

  // LANのスター型とバス型をクリック
  $('input[name=busSwitch]').click(function(){

    //NSF.fnAllReset();
    // NSF.lanArrClass = $("#nsf-main-canvas").attr("class").split(/\s?L_/);
    // NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
    // for(var i = 1; i < NSF.lanArrClass.length; i++) {
    //   NSF.fnLanDraw();
    //   //NSF.fnIfDraw(NSF.lanArrClass[i]);
    // }

    //バスをoffにする
    if ($('input[name=busSwitch]').hasClass('busOn')) {
      $("#nsf-main").off("mousedown", NSF.fnBusDown);
      $("#nsf-main").off("mouseup", NSF.fnBusUp);
      $("html").off("mouseup", NSF.fnBusOutUp);
      $("input[name=busSwitch]").removeClass('busOn');
    }
    //バスをonにする
    else {
      // イベントハンドラーを付ける
      $("#nsf-main").on("mousedown", NSF.fnBusDown);
      $("input[name=busSwitch]").addClass('busOn');

      //lanがonの時offに切り替え
      if ($('#lan').attr('src') == '/assets/lanCable_2.png') {
        NSF.changeLanMode();
      }
    }
  });



  // nsf-main

  // nsf-mainにドロップ
  $("#nsf-main").droppable({
    accept: '.machinery',
    tolerance: 'fit',
    // ドロップされたとき
    drop: function(e, ui){
      NSF.fnMainDrop(ui, $(this));
      NSF.mainDropFlg = false;
    },
    // ドロップを受け入れる Draggable 要素がドラッグを終了したとき
    deactivate: function(e, ui){
      ui.draggable.draggable({ revert: NSF.mainDropFlg });
      if(NSF.mainDropFlg === false) {
        NSF.mainDropFlg = true;
      }
    }
  });

  // nsf-mainの画像の上にいるとき
  $("#nsf-main").on("mouseover", "img", function(e){

    $(e.target).addClass('mouseover');

    $("#nsf-right dt:contains('"+ $(this).attr("alt") +"'), #nsf-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "#49cbf6",
    });
  }).on("mouseout", "img", function(e){
    $("#nsf-right dt:contains('"+ $(this).attr("alt") +"'), #nsf-right dt:contains('"+ $(this).attr("alt") +"') + dd").css({
      color: "",
    });
  });

  //busの上にある時
  $("#nsf-main").on("mouseover", ".bus", function(e){
    //if ($('#lan').attr('src') === '/assets/lanCable.png') {
      $(e.target).addClass('bus-mouseover');
      $(e.target).draggable();
    //}
  });

  ////nsf-mainの画像の上から外れた時
  $("#nsf-main").on("mouseout", "img", function(e){

    $(e.target).removeClass('mouseover');

  });

  //nsf-mainのバスの上から外れた時
  $("#nsf-main").on("mouseout", ".bus", function(e){

    $(e.target).removeClass('bus-mouseover');

  });

  //バスのドラック後
  $("#nsf-main").on("mouseup", ".bus", function(e){
    NSF.fnLanDraw();
  });


  //animecanvasを削除
  $('body').click(function () {
    $('.animecanvasflag').remove();
  });

  //描画中にnsf-main-canvasの外に出た時描画を中止する
  $('html').on('mouseover', function (e) {
    console.log('mouseover html: ');
    if ($(e.target).attr('id') != 'nsf-main-canvas' && NSF.busDrawFrag == true && $(e.target).hasClass('ui-draggable') == false) {
      NSF.points = [];
      NSF.addCanvas.remove();
      NSF.busDrawFrag = false;
      // イベントハンドラの削除
      $('#nsf-main').off('mousemove', NSF.fnBusDrag);
      $('#nsf-main').off('mouseup', NSF.fnbusUp);
    }
    if ($(e.target).attr('id') != 'nsf-main-canvas') {
      //console.log('nsf-main-canvas外');
    }
    if (NSF.lanFlagPoint === true) {
      console.log('lanPointがtrue');
    }

    if ($(e.target).attr('id') != 'nsf-main-canvas' && NSF.lanFlagPoint == true && $(e.target).hasClass('ui-draggable') == false) {
      console.log('消したるで');
      NSF.addCanvas.remove();
      if(!(NSF.lanFlaglink)) {
        $(".sP_"+ NSF.lanNode).removeClass("lanLink");
      }
      $("#nsf-main").off("mousemove", NSF.fnLanDrag);
      $("#nsf-main .ui-draggable").removeClass("lanFirst");
      $(".sP_"+ NSF.lanNode).removeClass("sP_"+ NSF.lanNode);
      $("#nsf-main-canvas").removeClass("L_"+ NSF.lanNode);
      // 変数とフラグをリセット
      NSF.points = [];
      NSF.lanFlaglink = false;
      NSF.lanFlagPoint = false;
    }
  });

  //マウスを動かしたら再描画
  $('#nsf-main').on('mousemove', function (e) {
    if ($('#nsf-main-canvas').attr('class') == '' && $('#nsf-main img').length > 0) {
      NSF.mainCtx.clearRect(0, 0, NSF.canvasWidth, NSF.canvasHeight);
      NSF.fnNameDraw();
    }
  });

  //infoに乗った時indexを上げる
  $('.info').on(({
    mouseover:function () {
      console.log(e);
    }
  }));

  //busからmouseを離す
  $('.bus').on('click', function (e) {
    console.log('a');
  });

  $('.bus').mouseout(function () {
    console.log('1');
  })



  // nsf-right

  // nsf-rightのimgをクリック
  $("#nsf-right").on("click", "img", function(){
    var elthis = $(this);
    if(elthis.attr("src") === "/assets/plus.jpg") {
      elthis.attr("src", "/assets/minus.jpg");
      elthis.parent("dt").next().show();
    }
    else if(elthis.attr("src") === "/assets/minus.jpg") {
      elthis.attr("src", "/assets/plus.jpg");
      elthis.parent("dt").next().hide();
    }
  });

  // nsf-right-infoのimgをクリック
  $("#nsf-right-info img").on("click", function(){
    if($(this).attr("src") === "/assets/open.png") {
      $("#nsf-right dd").show();
      $("#nsf-right dt img").attr("src", "/assets/minus.jpg");
    }
    if($(this).attr("src") === "/assets/close.png") {
      $("#nsf-right dd").hide();
      $("#nsf-right dt img").attr("src", "/assets/plus.jpg");
    }
  });


  //行動を保存する
  $('html').on('click', function (e) {

    $.ajax({
      type: 'POST',
      dataType: 'text',
      url: 'js/sample1.json',
      //url: 'NewNetworkSimulator/php/collect_questions.php',
      data:{id : NSF.urlparameter, timeStamp: e.timeStamp, outerHTML: e.target.outerHTML}
    });
  });

  });

});
