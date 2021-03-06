/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// waits till DOM loads
$(document).ready(() => {
  // DOM elements MAP
  const elementsMap = {
    validCounterLength: 140,
    tweets_container: $('#tweets__container')[0],
    errorParagraph: $('.error__message')[0],
    tweetForm: $('.new-tweet form')[0],
    textarea: $('.new-tweet form > textarea')[0],
    counter: $('.form__footer .counter')[0],
    compose: $('.compose__box')[0],
    newTweet: $('.container .new-tweet')[0]
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
    $.ajax({
      type: 'GET',
      url: '/tweets',
      success: function(resp) {
        renderTweets(resp);
      },
      error: function(err) {
        console.log(err);
      }
    });
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

  //callback function for submitting a tweet
  const submitTweet = e => {
    event.preventDefault();
    let errorMessage = '';
    const tweetText = elementsMap.textarea.value;
    if (!hasError(tweetText)) {
      errorMessage = '';
      if (event.keyCode === 13 || e.type === 'submit') {
        $.ajax({
          type: 'POST',
          url: '/tweets',
          data: `text=${tweetText}`,
          success: function(resp) {
            renderTweets([resp]);
          },
          error: function(err) {
            console.log(err);
          }
        });
        elementsMap.textarea.value = '';
        elementsMap.counter.textContent = elementsMap.validCounterLength;
      }
    }
  };

  // added event listeners for submit and enter on form
  $('.new-tweet form').on('keyup', submitTweet);
  $('.new-tweet form').on('submit', submitTweet);

  // add event listner to compose box
  $('.compose__box').on('click', e => {
    $('.container .new-tweet').toggleClass('visible');
    elementsMap.textarea.focus();
  });

  // function to return html template for article with data inserted from the tweet object
  const createTweetElement = tweetObj => {
    const { created_at } = tweetObj;
    const now = new Date().getTime();
    let tweetAge = now - created_at;
    let sufix = '';
    // add the time stamp with correct sufix;
    if (tweetAge >= 31557600000) {
      sufix += 'year ago';
      tweetAge = Math.floor(tweetAge / 31557600000);
    } else if (tweetAge >= 86400000) {
      sufix += 'days ago';
      tweetAge = Math.floor(tweetAge / 86400000);
    } else if (tweetAge >= 3600000) {
      sufix += 'hours ago';
      tweetAge = Math.floor(tweetAge / 3600000);
    } else if (tweetAge >= 60000) {
      sufix += 'minutes ago';
      tweetAge = Math.floor(tweetAge / 60000);
    } else {
      sufix += 'Just now';
      tweetAge = '';
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
