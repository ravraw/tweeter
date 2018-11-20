console.log('hellow fro counter');

$(document).ready(() => {
  // all DOM elements being used
  const elementsObj = {
    validCounterLength: 140,
    counter: $('.form__footer .counter'),
    textArea: $("textarea[name='text']")
  };

  console.log('DOM fully loaded and parsed');

  // change counter

  $("textarea[name='text']").on('keyup', function(e) {
    // characters left
    let charLeft = elementsObj.validCounterLength - e.target.value.length;
    // chnage text of counter element
    $('.form__footer .counter').text(charLeft);
    // if else to chheck if counter is of valid length
    if (charLeft < 0) {
      $('.form__footer .counter').addClass('.invalid');
    } else {
      $('.form__footer .counter').removeClass('.invalid');
    }
  });
});
