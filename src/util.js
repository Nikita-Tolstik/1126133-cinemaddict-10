import {ZERO, ONE, RANDOM_NUMBER} from './const.js';
import {createCardFilmTemplate} from './components/card-film.js';


const MINUTE = 60;
const TWO = 2;

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + ONE - min));
};

const getRatingNumber = (min, max) => {
  return getRandomNumber(min, max) + Number(Math.random().toFixed(1));
};


const getDescription = (allSentences, max) => {
  return allSentences
    .filter(() => Math.random() > RANDOM_NUMBER)
    .slice(ZERO, getRandomNumber(ONE, max))
    .join(` `);
};

const getTimeFilm = (time) => {

  return time < MINUTE ? `${time}m` : `${Math.floor(time / MINUTE)}h ${time % MINUTE}m`;

};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const renderExtraFilmBlock = (cards, feature, blockElement, extraElement) => {

  if (cards.length > ZERO) {

    const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
    const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

    if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
      extraElement.remove();
    } else if (isSame) {
      new Array(TWO).fill(``).forEach(() => render(blockElement, createCardFilmTemplate(cards[getRandomNumber(ZERO, cards.length - ONE)]), `beforeend`));
    } else {
      sortCards.slice(ZERO, TWO).forEach((card) => render(blockElement, createCardFilmTemplate(card), `beforeend`));
    }

  } else {
    extraElement.remove();
  }
};

export {getRandomNumber, getRatingNumber, getDescription, getTimeFilm, render, renderExtraFilmBlock};


