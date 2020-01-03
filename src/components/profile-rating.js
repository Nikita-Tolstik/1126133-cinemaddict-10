import AbstractSmartComponent from './smart-component.js';
import {getWatchedMovies} from '../utils/filter.js';

const NumberRating = {
  ZERO: 0,
  ONE: 1,
  TEN: 10,
  ELEVEN: 11,
  TWENTY: 20
};

const ProfileLevel = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

const getRating = (number) => {
  let level;
  switch (true) {
    case (number === NumberRating.ZERO):
      level = ``;
      break;
    case (number >= NumberRating.ONE && number <= NumberRating.TEN):
      level = ProfileLevel.NOVICE;
      break;
    case (number >= NumberRating.ELEVEN && number <= NumberRating.TWENTY):
      level = ProfileLevel.FAN;
      break;
    default:
      level = ProfileLevel.MOVIE_BUFF;
  }
  return level;
};

const createProfileRatingTemplate = (movies) => {

  const quantityWatchedMovies = getWatchedMovies(movies).length;

  const userRating = getRating(quantityWatchedMovies);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class ProfileRating extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
  }

  getTemplate() {
    return createProfileRatingTemplate(this._moviesModel.getAllMovies());
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {}
}
