const text = document.querySelector('textArea');

text.addEventListener('focus', e => {
  console.log(e.type);
});
text.addEventListener('mouseover', e => {
  console.log(e.type);
});
text.addEventListener('mouseenter', e => {
  console.log(e.type);
});
text.addEventListener('mouseleave', e => {
  console.log(e.type);
});
text.addEventListener('click', e => {
  console.log(e.type);
});
text.addEventListener('blur', e => {
  console.log(e.type);
});
text.addEventListener('keydown', e => {
  console.log(e.type);
});
text.addEventListener('keyup', e => {
  console.log(e.type);
});
