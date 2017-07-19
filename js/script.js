document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('preloader').style.visibility="hidden";
         document.getElementById('contents').style.visibility="visible";
      },1000);
      if ($('.parallax-background').length) {
        $(".parallax-background").parallax();
    }
  }
}
// Parallax
$(document).ready(function(){
    
});