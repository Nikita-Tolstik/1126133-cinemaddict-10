import AbstractComponent from './abstract-component.js';
import {getTimeFilm} from '../utils/common.js';
import {ZERO} from '../const.js';

const getYear = (date) => {

  const time = new Date(date);

  return time.getFullYear();

};

const createCardFilmTemplate = (card) => {

  const {title, image, description, rating, date, time, genres, comment} = card.filmInfo;

  const timeFilm = getTimeFilm(time);
  const filmYear = getYear(date);
  const mainGenre = genres[ZERO];

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
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist film-card__controls-item--active">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
    </article>`);
};

export default class ProfileRating extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createCardFilmTemplate(this._card);
  }
}
