/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// waits till DOM loads
document.addEventListener('DOMContentLoaded', e => {
  console.log('DOM fully loaded and parsed from app.js');
  // Fake data taken from tweets.json
  const data = [
    {
      user: {
        name: 'Newton',
        avatars: {
          small:
            'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png',
          regular:
            'https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png',
          large:
            'https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png'
        },
        handle: '@SirIsaac'
      },
      content: {
        text:
          'If I have seen further it is by standing on the shoulders of giants'
      },
      created_at: 1461116232227
    },
    {
      user: {
        name: 'Descartes',
        avatars: {
          small:
            'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png',
          regular:
            'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png',
          large:
            'https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png'
        },
        handle: '@rd'
      },
      content: { text: 'Je pense , donc je suis' },
      created_at: 14611139
    },
    {
      user: {
        name: 'Johann von Goethe',
        avatars: {
          small:
            'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png',
          regular:
            'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png',
          large:
            'https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png'
        },
        handle: '@johann49'
      },
      content: {
        text: 'Es ist nichts schrecklicher als eine tätige Unwissenheit.'
      },
      created_at: 1461
    }
  ];

  // function to return html template for article with data inserted from the tweet object
  const createTweetElement = tweetObj => {
    let { created_at } = tweetObj;
    let sufix = '';
    switch (true) {
      case created_at >= 31557600000:
        sufix += 'year ago';
        created_at = Math.floor(created_at / 31557600000);
        console.log(sufix);
        break;
      case created_at >= 86400000:
        sufix += 'days ago';
        created_at = Math.floor(created_at / 86400000);
        console.log(sufix);
        break;
      case created_at >= 3600000:
        sufix += 'hours ago';
        created_at = Math.floor(created_at / 3600000);
        break;
      case created_at >= 60000:
        sufix += 'minutes ago';
        created_at = Math.floor(created_at / 60000);
        break;
      default:
        sufix += 'seconds ago';
        created_at = Math.floor(created_at / 1000);
        break;
    }

    // console.log(typeof created_at);
    // console.log(created_at);
    // console.log(sufix);
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
          <p class="tweet__time">${created_at} ${sufix}</p>
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

  // loop and renderTweets
  const renderTweets = tweetsArray => {
    tweetsArray.forEach(tweet => {
      const tweetHtml = createTweetElement(tweet);
      const tweets_container = document.querySelector('#tweets__container');
      tweets_container.insertAdjacentHTML('afterbegin', tweetHtml);
    });
  };

  renderTweets(data);
});
