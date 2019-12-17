import AbstractSmartComponent from './smart-component.js';
import {ZERO, ONE, MONTH_NAMES} from '../const.js';
import {getRandomNumber, getTimeFilm} from '../utils/common.js';
import {removePopup} from '../utils/render.js';


const COMMENT_MAX = 7;


const FacesEmoji = {
  SMILE: `smile.png`,
  SLEEPING: `sleeping.png`,
  PUKE: `puke.png`,
  ANGRY: `angry.png`
};

const FACES = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`
];

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Very very interesting movie`,
  `I liked the actors and the genre of the film`,
  `Cool special effects and shooting`
];

const COMMENT_AUTHORS = [
  `Jeff Bridges`,
  `Sidney Poitier`,
  `Gene Hackman`,
  `Charles Chaplin`,
  `Ben Kingsley`,
  `Russell Crowe`,
  `Ralph Fiennes`
];

const TIMES = [
  `2019/12/31 23:59`,
  `2018/05/24 10:37`,
  `2016/03/15 16:25`,
  `Today`,
  `2 days ago`,
  `Yesterday`
];


const generateGenreTemplate = (allGenres) => {

  const newGenres = allGenres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join(`\n`);

  return newGenres;

};

const generateCommentTemplate = () => {

  const emoji = FACES[getRandomNumber(ZERO, FACES.length - ONE)];
  const comment = COMMENTS[getRandomNumber(ZERO, COMMENTS.length - ONE)];
  const author = COMMENT_AUTHORS[getRandomNumber(ZERO, COMMENT_AUTHORS.length - ONE)];
  const time = TIMES[getRandomNumber(ZERO, TIMES.length - ONE)];

  return (
    `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${time}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
  );
};

const getDateMonthYear = (date) => {

  const newDate = new Date(date);

  return `${newDate.getDate()} ${MONTH_NAMES[newDate.getMonth()]} ${newDate.getFullYear()}`;

};

const createButtonMarkup = (name, nameButton, isActive) => {

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id=${name} name=${name} ${isActive ? `checked` : ``}>
    <label for=${name} class="film-details__control-label film-details__control-label--${name}">${nameButton}</label>`
  );

};

const createRatingBlockMarkup = (isWatched, image, title) => {


  return (isWatched ?
    `<div class="form-details__middle-container">
    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="./images/posters/${image}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">
            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
            <label class="film-details__user-rating-label" for="rating-1">1</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
            <label class="film-details__user-rating-label" for="rating-2">2</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
            <label class="film-details__user-rating-label" for="rating-3">3</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
            <label class="film-details__user-rating-label" for="rating-4">4</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
            <label class="film-details__user-rating-label" for="rating-5">5</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
            <label class="film-details__user-rating-label" for="rating-6">6</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
            <label class="film-details__user-rating-label" for="rating-7">7</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
            <label class="film-details__user-rating-label" for="rating-8">8</label>

            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
            <label class="film-details__user-rating-label" for="rating-9">9</label>

          </div>
        </section>
      </div>
    </section>
  </div>` : ``);
};

const createPersonalRatingMarkup = (isWatched) => {

  return (isWatched ? `<p class="film-details__user-rating">Your rate 9</p>` : ``);

};

const createAddEmojiMarkup = (isEmoji, emojiImage) => {

  return (
    isEmoji ? `<img src="./images/emoji/${emojiImage}" width="55" height="55" alt="emoji">` : ``
  );
};

const createFilmDetailsPopupTemplate = (card, options = {}) => {

  const {title, originalTitle, image, age, rating, director, actor, writer, time, country, description, date, genres} = card.filmInfo;

  const {isWatchlist, isWatched, isFavorite, isEmoji, emojiImage} = options;

  const timeFilm = getTimeFilm(time);
  const genreTemplate = generateGenreTemplate(genres);
  const isOneGenre = genres.length === ONE;

  const randomNumber = getRandomNumber(ONE, COMMENT_MAX);
  const countComment = new Array(randomNumber).fill(``);
  const commentTemplate = countComment.map(() => generateCommentTemplate()).join(`\n`);
  const dateFilm = getDateMonthYear(date);

  const watchlistButton = createButtonMarkup(`watchlist`, `Add to watchlist`, isWatchlist);
  const watchedButton = createButtonMarkup(`watched`, `Already watched`, isWatched);
  const favoriteButton = createButtonMarkup(`favorite`, `Add to favorites`, isFavorite);

  const ratingMarkup = createRatingBlockMarkup(isWatched, image, title);
  const personalRatingMarkup = createPersonalRatingMarkup(isWatched);

  const emojiComment = createAddEmojiMarkup(isEmoji, emojiImage);


  return (
    `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="form-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/${image}" alt="">

        <p class="film-details__age">${age}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${originalTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${rating}</p>

            ${personalRatingMarkup}

          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writer}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actor}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${dateFilm}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${timeFilm}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${isOneGenre ? `Genre` : `Genres`}</td>
            <td class="film-details__cell">${genreTemplate}</td>
          </tr>
        </table>

        <p class="film-details__film-description">${description}</p>
      </div>
    </div>

    <section class="film-details__controls">


    ${watchlistButton}
    ${watchedButton}
    ${favoriteButton}


    </section>
  </div>

    ${ratingMarkup}

  <div class="form-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComment.length}</span></h3>

      <ul class="film-details__comments-list">
        ${commentTemplate}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
        ${emojiComment}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
          <label class="film-details__emoji-label" for="emoji-gpuke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>
  </div>
</form>
</section>`
  );
};

export default class ProfileRating extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;

    this._isWatchlist = this._card.userDetails.isWatchlist;
    this._isWatched = this._card.userDetails.isWatched;
    this._isFavorite = this._card.userDetails.isFavorite;

    this._isEmoji = null;
    this._emojiImage = null;


    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._card, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      isEmoji: this._isEmoji,
      emojiImage: this._emojiImage
    });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  // Сброс неотправленных комментариев-эмодзи при закрытии попапа
  resetEmoji() {

    this._isEmoji = null;
    this._emojiImage = null;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__controls`)
      .addEventListener(`change`, (evt) => {

        switch (evt.target.id) {
          case `watchlist`:
            this._isWatchlist = !this._isWatchlist;
            break;
          case `watched`:
            this._isWatched = !this._isWatched;
            break;
          case `favorite`:
            this._isFavorite = !this._isFavorite;
            break;
        }

        this.rerender();
      });

    element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, () => {
        removePopup(this);
      });

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        evt.stopPropagation();


        switch (evt.target.id) {
          case `emoji-smile`:
            this._emojiImage = FacesEmoji.SMILE;
            break;
          case `emoji-sleeping`:
            this._emojiImage = FacesEmoji.SLEEPING;
            break;
          case `emoji-gpuke`:
            this._emojiImage = FacesEmoji.PUKE;
            break;
          case `emoji-angry`:
            this._emojiImage = FacesEmoji.ANGRY;
            break;
        }

        if (this._emojiImage) {

          this._isEmoji = true;
          this.rerender();
        }
      });
  }
}


// setOnClickCloseButtonPopup(handler) {
//   this.getElement().querySelector(`.film-details__close-btn`)
//     .addEventListener(`click`, handler);
// }
