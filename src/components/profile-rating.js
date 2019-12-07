import {getRandomNumber, createElement} from '../util.js';
import {ZERO} from '../const.js';


const COUNT_MAX = 30;

const getRating = (number) => {
  let level;
  switch (true) {
    case (number === 0):
      level = ``;
      break;
    case (number >= 1 && number <= 10):
      level = `Novice`;
      break;
    case (number >= 11 && number <= 20):
      level = `Fan`;
      break;
    default:
      level = `Movie Buff`;
  }
  return level;
};


const createProfileRatingTemplate = () => {

  const userRating = getRating(getRandomNumber(ZERO, COUNT_MAX));

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class ProfileRating {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createProfileRatingTemplate();
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
