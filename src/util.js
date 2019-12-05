import {ZERO, ONE, RANDOM_NUMBER} from './const.js';
import CardFilmComponent from './components/card-film.js';


const MINUTE = 60;
const TWO = 2;
const NUMBER_TIME = 2999547470716;

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`
};

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

// Отрсивока компонентов на страницу
const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
  }
};

// Создание елемента из разметки
const createElement = (template) => {

  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const renderExtraFilmBlock = (cards, feature, blockElement, extraElement) => {

  if (cards.length > ZERO) {

    const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
    const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

    if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
      extraElement.remove();
    } else if (isSame) {
      new Array(TWO).fill(``).forEach(() => render(blockElement, new CardFilmComponent(cards[getRandomNumber(ZERO, cards.length - ONE)]).getElement(), RenderPosition.BEFOREEND));
    } else {
      sortCards.slice(ZERO, TWO).forEach((card) => render(blockElement, new CardFilmComponent(card).getElement(), RenderPosition.BEFOREEND));
    }

  } else {
    extraElement.remove();
  }
};


const getRandomDate = () => {

  const targetDate = new Date();
  const diffValue = getRandomNumber(ZERO, NUMBER_TIME);

  targetDate.setTime(targetDate.getTime() - diffValue);

  return targetDate.getTime();
};

export {getRandomNumber, getRatingNumber, getDescription, getTimeFilm, renderExtraFilmBlock, getRandomDate, RenderPosition, createElement, render};
