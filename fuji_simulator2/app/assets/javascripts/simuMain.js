
$.when(
  $.ready,
  $.getScript("/assets/simuDec.js"),
  $.getScript("/assets/simuFunc.js"),
).then(function(){
  console.log(test);
  console.log(don);



});
