import {GENRES, RANDOM_NUMBER, ZERO, ONE, MONTH_NAMES} from '../const.js';
import {getRandomNumber, getTimeFilm, createElement} from '../util.js';

const COMMENT_MAX = 7;


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
    .filter(() => Math.random() > RANDOM_NUMBER)
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


const createFilmDetailsPopupTemplate = (card) => {

  const {title, originalTitle, image, age, rating, director, actor, writer, time, country, description, date} = card;

  const timeFilm = getTimeFilm(time);
  const genreTemplate = generateGenreTemplate(GENRES);
  const randomNumber = getRandomNumber(ONE, COMMENT_MAX);
  const commentTemplate = new Array(randomNumber).fill(``).map(() => generateCommentTemplate());
  const dateFilm = getDateMonthYear(date);

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
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">${genreTemplate}</td>
          </tr>
        </table>

        <p class="film-details__film-description">${description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>
  </div>

  <div class="form-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

      <ul class="film-details__comments-list">
        ${commentTemplate}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

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

export default class ProfileRating {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
