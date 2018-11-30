$(function() {
  $('#bottom').click(function(){
    console.log('bottom');
    $.ajax({
      url: '/home/grade',
      type 'POST',
    });
  })
});
