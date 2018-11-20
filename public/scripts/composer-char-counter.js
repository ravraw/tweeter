console.log('hellow fro counter');

//document.addEventListener('DOMContentLoaded', e => {
$(document).ready(() => {
  // all DOM elements being used
  const elementsObj = {
    validCounterLength: 140,
    counter: $('.form__footer .counter'),
    textArea: $("textarea[name='text']")
  };

  console.log('DOM fully loaded and parsed');

  // change counter
  //elementsObj.textArea.addEventListener('keyup', function(e) {
  $("textarea[name='text']").on('keyup', function(e) {
    //console.log(e.target.value.length);
    // characters left
    let charLeft = elementsObj.validCounterLength - e.target.value.length;
    // chnage text of counter element
    //elementsObj.counter.textContent = charLeft;
    $('.form__footer .counter').text(charLeft);
    // if else to chheck if counter is of valid length
    if (charLeft < 0) {
      //elementsObj.counter.classList.add('invalid');
      //elementsObj.counter.classList.add('invalid');
      $('.form__footer .counter').addClass('.invalid');
    } else {
      //elementsObj.counter.classList.remove('invalid');
      $('.form__footer .counter').removeClass('.invalid');
    }
  });
});
