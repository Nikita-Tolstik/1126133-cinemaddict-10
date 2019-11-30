import {getRandomNumber} from '../util.js';
import {ZERO} from '../const.js';

const COUNT_MAX = 300;

export const createProfileRatingTemplate = () => {

  const countFilm = getRandomNumber(ZERO, COUNT_MAX);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${countFilm} Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};
