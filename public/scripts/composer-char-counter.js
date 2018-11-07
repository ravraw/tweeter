console.log('hellow fro counter');

document.addEventListener('DOMContentLoaded', e => {
  // all DOM elements being used
  const elementsObj = {
    validCounterLength: 140,
    counter: document.querySelector('.form__footer .counter'),
    textArea: document.querySelector("textarea[name='text']")
  };

  console.log('DOM fully loaded and parsed');

  // change counter
  elementsObj.textArea.addEventListener('keyup', function(e) {
    // characters left
    let charLeft = elementsObj.validCounterLength - e.target.value.length;
    // chnage text of counter element
    elementsObj.counter.textContent = charLeft;
    // if else to chheck if counter is of valid length
    if (charLeft < 0) {
      elementsObj.counter.classList.add('invalid');
    } else {
      elementsObj.counter.classList.remove('invalid');
    }
    // console.log(elementsObj.counter.textContent);
  });
});
