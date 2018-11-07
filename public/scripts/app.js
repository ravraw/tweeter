/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// waits till DOM loads
document.addEventListener('DOMContentLoaded', e => {
  // DOM elements MAP
  const elementsMap = {
    tweets_container: document.querySelector('#tweets__container'),
    errorParagraph: document.querySelector('.error__message'),
    tweetForm: document.querySelector('.new-tweet form'),
    textarea: document.querySelector('.new-tweet form > textarea')
  };

  console.log('DOM fully loaded and parsed from app.js');
  // data variable
  let data;

  // loop and renderTweets
  const renderTweets = tweetsArray => {
    tweetsArray.forEach(tweet => {
      const tweetHtml = createTweetElement(tweet);
      elementsMap.tweets_container.insertAdjacentHTML('afterbegin', tweetHtml);
    });
  };

  // get tweets with ajax
  const loadTweets = () => {
    const request = new XMLHttpRequest();
    request.open('GET', '/tweets', true);
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('All tweets:', JSON.parse(this.responseText));
        data = JSON.parse(this.responseText);
        renderTweets(data);
      }
    };
    request.send();
  };
  loadTweets();

  // check error function
  const hasError = tweetText => {
    let error = false;
    if (tweetText.length === 0) {
      errorMessage = 'Enter something...';
      error = true;
    } else if (tweetText.length > 140) {
      errorMessage = 'Too many words ....';
      error = true;
    } else {
      errorMessage = '';
    }
    elementsMap.errorParagraph.textContent = errorMessage;
    return error;
  };

  // callback function for submitting a tweet
  const submitTweet = e => {
    event.preventDefault();
    let errorMessage = '';

    const tweetText = elementsMap.textarea.value;

    if (!hasError(tweetText)) {
      errorMessage = '';
      if (event.keyCode === 13 || e.type === 'submit') {
        const request = new XMLHttpRequest();
        request.open('POST', '/tweets', true);
        request.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8'
        );
        request.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 201) {
            console.log('New tweet :', JSON.parse(this.responseText));
            data = JSON.parse(this.responseText);
            renderTweets([data]);
          }
        };
        request.send(`text=${tweetText}`);
        elementsMap.textarea.value = '';
      }
    }
  };
  // added event listeners for submit and enter on form
  elementsMap.tweetForm.addEventListener('keyup', submitTweet);
  elementsMap.tweetForm.addEventListener('submit', submitTweet);
  elementsMap.tweetForm.addEventListener('blur', () => {});

  // function to return html template for article with data inserted from the tweet object
  const createTweetElement = tweetObj => {
    const { created_at } = tweetObj;
    const now = new Date().getTime();
    let tweetAge = now - created_at;
    let sufix = '';
    switch (true) {
      case tweetAge >= 31557600000:
        sufix += 'year ago';
        tweetAge = Math.floor(tweetAge / 31557600000);
        console.log(sufix);
        break;
      case tweetAge >= 86400000:
        sufix += 'days ago';
        tweetAge = Math.floor(tweetAge / 86400000);
        console.log(sufix);
        break;
      case tweetAge >= 3600000:
        sufix += 'hours ago';
        tweetAge = Math.floor(tweetAge / 3600000);
        break;
      case tweetAge >= 60000:
        sufix += 'minutes ago';
        tweetAge = Math.floor(tweetAge / 60000);
        break;
      default:
        sufix += 'seconds ago';
        tweetAge = Math.floor(tweetAge / 1000);
        break;
    }

    return `<article class="tweet">
        <header class="tweet__header">
          <img src='${tweetObj.user.avatars.small}' alt="avatar">
          <h2 class="user__name">${tweetObj.user.name}</h2>
          <p class="user__handle">${tweetObj.user.handle}</p>
        </header>
        <div class="tweet__body">
          <p>${tweetObj.content.text}</p>
        </div>
        <footer class="tweet__footer">
          <p class="tweet__time">${tweetAge} ${sufix}</p>
          <div class="icons__box">
            <div class=" tweet__icon-box ">
              <svg class="tweet__icon--flag ">
                <use xlink:href="./images/sprite.svg#flag "></use>
              </svg>
            </div>
            <div class="tweet__icon-box ">
              <svg class="tweet__icon--flag ">
                <use xlink:href="./images/sprite.svg#loop "></use>
              </svg>
            </div>
            <div class="tweet__icon-box ">
              <svg class="tweet__icon--flag ">
                <use xlink:href="./images/sprite.svg#like "></use>
              </svg>
            </div>
          </div>
        </footer>
      </article>
  `;
  };
});
