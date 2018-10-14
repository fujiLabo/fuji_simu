
$.when(
  $.ready,
  $.getScript("/assets/test.js")
).then(function(){
  console.log(test);
});
