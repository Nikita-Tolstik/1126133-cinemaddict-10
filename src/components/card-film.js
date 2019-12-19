import AbstractComponent from './abstract-component.js';
import {getTimeFilm} from '../utils/common.js';
import {ZERO} from '../const.js';

const getYear = (date) => {

  const time = new Date(date);

  return time.getFullYear();

};


const createButtonMarkup = (nameClass, nameButton, isActive = true) => {

  return (
    `<button class="film-card__controls-item button
    film-card__controls-item--${nameClass} ${isActive ? `film-card__controls-item--active` : ``}">${nameButton}</button>`
  );

};


const createCardFilmTemplate = (card) => {

  const {title, image, description, rating, date, time, genres, comment} = card.filmInfo;

  const timeFilm = getTimeFilm(time);
  const filmYear = getYear(date);
  const mainGenre = genres[ZERO];

  const watchlistButton = createButtonMarkup(`add-to-watchlist`, `Add to watchlist`, card.userDetails.isWatchlist);
  const watchedButton = createButtonMarkup(`mark-as-watched`, `Mark as watched`, card.userDetails.isWatched);
  const favoriteButton = createButtonMarkup(`favorite`, `Mark as favorite`, card.userDetails.isFavorite);

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmYear}</span>
      <span class="film-card__duration">${timeFilm}</span>
      <span class="film-card__genre">${mainGenre}</span>
    </p>
    <img src="./images/posters/${image}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comment} comments</a>
    <form class="film-card__controls">

     ${watchlistButton}
     ${watchedButton}
     ${favoriteButton}

    </form>
    </article>`);
};

export default class CardFilm extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createCardFilmTemplate(this._card);
  }

  setOnClickCardElements(handler) {

    let cardElements = [];

    cardElements.push(this.getElement().querySelector(`.film-card__poster`));
    cardElements.push(this.getElement().querySelector(`.film-card__title`));
    cardElements.push(this.getElement().querySelector(`.film-card__comments`));

    cardElements.forEach((element) => {
      element.addEventListener(`click`, handler);
    });
  }

  setOnWatchlistButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setOnWatchedButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setOnFavoriteButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
