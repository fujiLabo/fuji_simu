
//この書き方だとリロードでもjqueryを読み込む
$(document).on('turbolinks:load', function() {
  $('p').text("JQuery可動テスト(稼働中)");
});

$(function(){
  $('p').css('color','orenge');
});

//var str = "JS Test in Rails";
//console.log(str);
