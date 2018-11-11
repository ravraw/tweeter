/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// waits till DOM loads
document.addEventListener('DOMContentLoaded', e => {
  // DOM elements MAP
  const elementsMap = {
    validCounterLength: 140,
    tweets_container: document.getElementById('tweets__container'),
    errorParagraph: document.querySelector('.error__message'),
    tweetForm: document.querySelector('.new-tweet form'),
    textarea: document.querySelector('.new-tweet form > textarea'),
    counter: document.querySelector('.form__footer .counter'),
    compose: document.querySelector('.compose__box'),
    newTweet: document.querySelector('.container .new-tweet'),
    loginForm: document.querySelector('#login-form')
  };

  console.log('DOM fully loaded and parsed from app.js');

  elementsMap.compose.style.display = 'none';

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
    } else if (tweetText.length > elementsMap.validCounterLength) {
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
            data = JSON.parse(this.responseText);
            renderTweets([data]);
          }
        };
        request.send(`text=${tweetText}`);
        elementsMap.textarea.value = '';
        elementsMap.counter.textContent = elementsMap.validCounterLength;
      }
    }
  };
  // added event listeners for submit and enter on form
  elementsMap.tweetForm.addEventListener('keyup', submitTweet);
  elementsMap.tweetForm.addEventListener('submit', submitTweet);

  // add event listner to compose box
  elementsMap.compose.addEventListener('click', e => {
    elementsMap.newTweet.classList.toggle('visible');
    elementsMap.textarea.focus();
  });

  //add event listener to like tweet
  setTimeout(() => {
    const likes = document.querySelector('#tweets__container');
    let liked = false;
    likes.addEventListener('click', e => {
      let parent = e.target.parentElement;
      if (parent.parentElement.id == 'likesBox') {
        liked = !liked;
        let count = liked ? 1 : -1;
        console.log(liked);
        parent.classList.toggle('red');
        const id = parent.closest('article').dataset.id;

        const request = new XMLHttpRequest();
        request.open('POST', `/tweets/${id}/likes`, true);
        request.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=UTF-8'
        );
        request.onreadystatechange = function() {
          console.log(this.status);
          if (this.readyState == 4 && this.status == 201) {
            //data = JSON.parse(this.responseText);
            //renderTweets([data]);
            //console.log(this.responseText);
          }
        };
        request.send(`id=${id}&count=${count}`);
        // elementsMap.textarea.value = '';
        // elementsMap.counter.textContent = //elementsMap.validCounterLength;
      }
    });
  }, 2000);

  // function to return html template for article with data inserted from the tweet object
  const createTweetElement = tweetObj => {
    const { created_at } = tweetObj;
    const now = new Date().getTime();
    let tweetAge = now - created_at;
    let sufix = '';
    // add the time stamp with correct sufix;
    switch (true) {
      case tweetAge >= 31557600000:
        sufix += 'year ago';
        tweetAge = Math.floor(tweetAge / 31557600000);
        break;
      case tweetAge >= 86400000:
        sufix += 'days ago';
        tweetAge = Math.floor(tweetAge / 86400000);
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

    return `<article class="tweet" data-id=${tweetObj._id}>
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
              <svg class="tweet__icon--loop ">
                <use xlink:href="./images/sprite.svg#loop "></use>
              </svg>
            </div>
            <div id="likesBox" class="tweet__icon-box" >
              <svg  class="tweet__icon--like ">
                <use xlink:href="./images/sprite.svg#like ">
                </use>
              </svg>
              <span class ="tweet__like--count"id="likesCount">${
                tweetObj.likes
              }</span>
            </div>
          </div>
        </footer>
      </article>
  `;
  };

  // login - register form
  elementsMap.loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const data = { username, password };
    const request = new XMLHttpRequest();
    request.open('POST', `/users/login`, true);
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onreadystatechange = function() {
      console.log(this.status);
      if (this.readyState == 4 && this.status == 200) {
        console.log('Login working!!!!');
      }
    };
    request.send(`username=${username}&password=${password}`);
  });
});
