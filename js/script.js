function email(){
    var e = 'vincent';
    e += 'poke';
    e += 'tang';
    e += '@';
    e += 'gmail.com';
    $('.email').text(e);
    e = 'mailto:' + e;
    $('.email').attr('href', e);
    $('#email-icon').attr('href', e);
}
function phone(){
    var p = '626';
    p += '-233';
    p += '-2875';
    $('.phone').text(p);
    p = 'tel:' + p;
    $('.phone').attr('href', p);
    $('#phone-icon').attr('href', p);
}
document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
       document.getElementById('contents').style.visibility="hidden";
  }
  else if (state == 'complete') {
    setTimeout(function(){
        document.getElementById('interactive');
        document.getElementById('preloader').style.visibility="hidden";
        document.getElementById('contents').style.visibility="visible";
        email();
        phone();
    },1000);
    if ($('.parallax-background').length) {
        $(".parallax-background").parallax();
    }
  }
}