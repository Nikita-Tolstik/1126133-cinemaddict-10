import AbstractSmartComponent from './abstract-smart-component.js';
import {ONE, FilterType, TagName, ZERO, ElementClass, KeyDown} from '../const.js';
import {getTimeFilm, formatReleaseDate, formatCommentDate} from '../utils/common.js';
import {createElement} from '../utils/render.js';
import he from 'he';

const QUANTITY_SCORE = 9;
const STYLE_BORDER_COMMENT = `3px solid crimson`;

const TextButton = {
  DELETING: `Deleting…`,
  DELETE: `Delete`
};

const TimeAnimation = {
  MIN: 600,
  MAX: 1000
};

const Color = {
  RED: `red`,
  ACTIVE: `#ffe800`,
  NO_ACTIVE: `#d8d8d8`
};

const VariantGenre = {
  ONE_GENRE: `Genre`,
  MANY_GENRE: `Genres`
};

const StatusTemplate = {
  CHECKED: `checked`,
  DISABLED: `disabled`
};

const FacesEmoji = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};

const ButtonName = {
  WATCHLIST: `Add to watchlist`,
  WATCHED: `Already watched`,
  FAVORITE: `Add to favorites`
};

const generateGenreTemplate = (allGenres) => {

  const newGenres = allGenres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join(`\n`);

  return newGenres;

};

const generateCommentTemplate = (commentUser, idComment) => {

  const {author, comment, date, emotion} = commentUser;
  const id = `id=${idComment}`;
  const formatDate = formatCommentDate(date);
  const commentEncode = he.encode(comment);

  return (
    `<li class="film-details__comment" ${id}>
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${commentEncode}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${formatDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
  );
};

const createButtonMarkup = (name, nameButton, isActive) => {

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id=${name} name=${name} ${isActive ? StatusTemplate.CHECKED : ``}>
    <label for=${name} class="film-details__control-label film-details__control-label--${name}">${nameButton}</label>`
  );

};

const createNumberRatingMarkup = (rating) => {


  const templates = new Array(QUANTITY_SCORE).fill(``).map((it, i) => {
    const mark = i + ONE;

    return (`

    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${mark}" id="rating-${mark}" ${rating === mark ? StatusTemplate.CHECKED : ``} ${rating !== ZERO ? StatusTemplate.DISABLED : ``}>
  <label class="film-details__user-rating-label" for="rating-${mark}">${mark}</label>

    `);
  }).join(`\n`);

  return templates;
};

const createRatingBlockMarkup = (isWatched, image, title, rating) => {

  const markupRating = createNumberRatingMarkup(rating);

  return (isWatched ?
    `<div class="form-details__middle-container">
    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="./${image}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <div class="film-details__user-rating-score">

            ${markupRating}

          </div>
        </section>
      </div>
    </section>
  </div>` : ``);
};

const createPersonalRatingMarkup = (isWatched, rating) => {

  return (isWatched && rating ? `<p class="film-details__user-rating">Your rate ${rating}</p>` : ``);
};

const createAddEmojiMarkup = (isEmoji, emojiImage) => {

  return (
    isEmoji ? `<img src="./images/emoji/${emojiImage}.png" width="55" height="55" alt="emoji">` : ``
  );
};

const createFilmDetailsPopupTemplate = (card, options = {}) => {

  const {title, originalTitle, image, age, rating, director, actors, writers, time, country, description, date, genres, commentUsers} = card.filmInfo;
  const {personalRating} = card.userDetails;

  const {isWatchlist, isWatched, isFavorite} = options;

  const timeFilm = getTimeFilm(time);
  const genreTemplate = genres.length === ZERO ? `` : generateGenreTemplate(genres);
  const isOneGenre = genres.length < ONE;


  const commentCount = commentUsers.length;
  const dateFilm = formatReleaseDate(date);

  const watchlistButton = createButtonMarkup(FilterType.WATCHLIST, ButtonName.WATCHLIST, isWatchlist);
  const watchedButton = createButtonMarkup(FilterType.WATCHED, ButtonName.WATCHED, isWatched);
  const favoriteButton = createButtonMarkup(FilterType.FAVORITE, ButtonName.FAVORITE, isFavorite);

  const ratingMarkup = createRatingBlockMarkup(isWatched, image, title, personalRating);
  const personalRatingMarkup = createPersonalRatingMarkup(isWatched, personalRating);

  const commentTemplate = commentUsers.map((it) => generateCommentTemplate(it, it.id)).join(`\n`);

  return (
    `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="form-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${image}" alt="${title}">

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
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
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
            <td class="film-details__term">${isOneGenre ? VariantGenre.ONE_GENRE : VariantGenre.MANY_GENRE}</td>
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
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentCount}</span></h3>

      <ul class="film-details__comments-list">
        ${commentTemplate}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">

        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="puke">
          <label class="film-details__emoji-label" for="emoji-gpuke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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

export default class FilmDetails extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;

    this._isWatchlist = this._card.userDetails.isWatchlist;
    this._isWatched = this._card.userDetails.isWatched;
    this._isFavorite = this._card.userDetails.isFavorite;

    this._isEmoji = null;
    this._emojiImage = null;

    this._closeButtonHandler = null;
    this._watchlistHandler = null;
    this._watchedHandler = null;
    this._favoriteHandler = null;
    this._deleteCommentButtonHandler = null;
    this._submitFormHandler = null;
    this._ratingHandler = null;
    this._undoButtonHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._card, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite
    });
  }

  recoveryListeners() {
    this.setClickCloseButtonPopupHandler(this._closeButtonHandler);
    this.setWatchlistInputClickHandler(this._watchlistHandler);
    this.setWatchedInputClickHandler(this._watchedHandler);
    this.setFavoriteInputClickHandler(this._favoriteHandler);
    this.setClickDeleteCommentButtonHandler(this._deleteCommentButtonHandler);
    this.setFormSubmitHandler(this._submitFormHandler);
    this.setClickRatingInputHandler(this._ratingHandler);
    this.setClickUndoButtonHandler(this._undoButtonHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  resetSmile() {
    this._isEmoji = null;
    this._emojiImage = null;

    this.rerender();
  }

  getFormData() {
    const form = this.getElement().querySelector(`form`);

    return new FormData(form);
  }

  setDisableScore(isDisabled) {
    [...this.getElement().querySelectorAll(`.film-details__user-rating-score input`)].forEach((input) => {
      input.disabled = isDisabled;
    });
  }

  setDisableEmoji(isDisabled) {
    [...this.getElement().querySelectorAll(`.film-details__emoji-list input`)].forEach((input) => {
      input.disabled = isDisabled;
    });
  }

  setColorScore(activeColor) {

    [...this.getElement().querySelectorAll(`.film-details__user-rating-score label`)].forEach((element) => {
      element.style.backgroundColor = Color.NO_ACTIVE;
    });

    this.getElement().querySelector(`.film-details__user-rating-score input:checked + label`).style.backgroundColor = activeColor;
  }

  setAddCommentError() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
    this.getElement().querySelector(`.film-details__comment-input`).style.border = STYLE_BORDER_COMMENT;
  }

  setDeleteCommentError() {
    this.getElement().querySelector(`.film-details__comments-list .${ElementClass.DELETE} button`).textContent = TextButton.DELETE;
    this.getElement().querySelector(`.film-details__comments-list .${ElementClass.DELETE} button`).disabled = false;
  }

  setRatingError() {
    if (this.getElement().querySelector(`.form-details__middle-container`)) {

      this.setColorScore(Color.RED);
      this.setDisableScore(false);
    }
  }

  setShake(classElement) {
    if (this.getElement().querySelector(`.film-details__${classElement}`)) {

      this.getElement().querySelector(`.film-details__${classElement}`).style.animation = `${ElementClass.SHAKE} ${TimeAnimation.MIN / TimeAnimation.MAX}s`;

      setTimeout(() => {
        this.getElement().querySelector(`.film-details__${classElement}`).style.animation = ``;
      }, TimeAnimation.MIN);
    }
  }

  _createEmojiMarkup(isEmoji, emojiImage) {

    let emojiElement = this.getElement().querySelector(`.film-details__add-emoji-label img`);

    if (emojiElement) {
      emojiElement.remove();
      emojiElement = null;
    }

    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const emojiTemplate = createElement(createAddEmojiMarkup(isEmoji, emojiImage));

    container.append(emojiTemplate);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();

        switch (evt.target.value) {
          case FacesEmoji.SMILE:
            this._emojiImage = FacesEmoji.SMILE;
            break;
          case FacesEmoji.SLEEPING:
            this._emojiImage = FacesEmoji.SLEEPING;
            break;
          case FacesEmoji.PUKE:
            this._emojiImage = FacesEmoji.PUKE;
            break;
          case FacesEmoji.ANGRY:
            this._emojiImage = FacesEmoji.ANGRY;
            break;
        }

        if (this._emojiImage) {

          this._isEmoji = true;
          this._createEmojiMarkup(this._isEmoji, this._emojiImage);
        }
      });
  }

  setClickCloseButtonPopupHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._closeButtonHandler = handler;
  }

  setWatchlistInputClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, handler);

    this._watchlistHandler = handler;
  }

  setWatchedInputClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, handler);

    this._watchedHandler = handler;
  }

  setFavoriteInputClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, handler);

    this._favoriteHandler = handler;
  }

  setClickDeleteCommentButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== TagName.BUTTON) {
        return;
      }

      evt.target.textContent = TextButton.DELETING;
      evt.target.disabled = true;

      const elem = evt.target.closest(TagName.LI);
      elem.classList.add(ElementClass.DELETE);

      handler();
    });

    this._deleteCommentButtonHandler = handler;
  }

  setFormSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__new-comment`)
    .addEventListener(`keydown`, (evt) => {

      if (this.getElement().querySelector(`.film-details__add-emoji-label`).children.length !== ZERO && evt.target.value.length !== ZERO) {

        if (evt.ctrlKey && (evt.key === KeyDown.ENTER || evt.key === KeyDown.ENT)) {
          this.getElement().querySelector(`.film-details__comment-input`).style.border = ``;

          handler();
          this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
          this.setDisableEmoji(true);
        }
      }
    });

    this._submitFormHandler = handler;
  }

  setClickRatingInputHandler(handler) {
    if (this.getElement().querySelector(`.film-details__user-rating-score`)) {

      this.getElement().querySelector(`.film-details__user-rating-score`)
        .addEventListener(`change`, (evt) => {
          evt.stopPropagation();

          const rating = this.getElement().querySelector(`.film-details__user-rating-score input:checked`).value;

          this.setDisableScore(true);

          this.setColorScore(Color.ACTIVE);

          handler(rating);
        });
    }
    this._ratingHandler = handler;
  }

  setClickUndoButtonHandler(handler) {
    if (this.getElement().querySelector(`.form-details__middle-container`)) {

      this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, (evt) => {
        evt.preventDefault();

        handler();
      });
    }

    this._undoButtonHandler = handler;
  }
}
