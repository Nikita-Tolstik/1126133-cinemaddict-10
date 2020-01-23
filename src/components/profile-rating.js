import AbstractSmartComponent from './abstract-smart-component.js';
import {getWatchedMovies} from '../utils/filter.js';
import {getRating} from '../utils/common.js';


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

  recoveryListeners() {}

  rerender() {
    super.rerender();
  }
}
