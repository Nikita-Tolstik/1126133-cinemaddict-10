import {createProfileRatingTemplate} from './components/profile-rating.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createCardFilmTemplate} from './components/card-film.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
// import {generateFilmCard} from './mock/card-film.js';
import {generateFilmCards} from './mock/card-film.js';
import {ZERO, ONE} from './const.js';

import {generateFilmDetails} from './mock/film-details.js';
import {createFilmDetailsPopupTemplate} from './components/film-details.js';


const COUNT_MAIN_CARDS = 20;
const COUNT_CARD_EXTRA = 2;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;

const mainCards = generateFilmCards(COUNT_MAIN_CARDS);
const ratedCards = generateFilmCards(COUNT_CARD_EXTRA);
const commentedCards = generateFilmCards(COUNT_CARD_EXTRA);
const FilmDetailsPopup = generateFilmDetails();

let render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

let siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileRatingTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const filmsListElements = siteFilmsElement.querySelectorAll(`.films-list__container`);


let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

mainCards.slice(ZERO, showingCardCount).forEach((card) => render(filmsListElements[0], createCardFilmTemplate(card), `beforeend`));


render(filmsListElements[ZERO], createLoadMoreButtonTemplate(), `afterend`);

ratedCards.forEach((card) => render(filmsListElements[ONE], createCardFilmTemplate(card), `beforeend`));
commentedCards.forEach((card) => render(filmsListElements[TWO], createCardFilmTemplate(card), `beforeend`));

const bodyElement = document.querySelector(`body`);
// render(bodyElement, createFilmDetailsPopupTemplate(FilmDetailsPopup), `beforeend`);

const loadMoreButtonElement = siteMainElement.querySelector(`.films-list__show-more`);


// Обработчик на кнопке показать еще
loadMoreButtonElement.addEventListener(`click`, () => {

  const prevCardCount = showingCardCount;
  showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  mainCards.slice(prevCardCount, showingCardCount).forEach((card) => render(filmsListElements[ZERO], createCardFilmTemplate(card), `beforeend`));


  if (showingCardCount >= mainCards.length) {
    loadMoreButtonElement.remove();
  }

});

const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics p`);
footerStatisticsElement.textContent = `${mainCards.length} movies inside`;

export {mainCards};

// отсортировал элементы, теперь нужно создать функцию (параметром функции будет массив карточек), которая будет выполнять различные проверки
//  и в соответствии с этими проверками выполнять отрисовку 2 лучших карточек, или 2 случайные карточки если показатели равны
// или не будет отображать их и будет удалять блок популярности, если показатели фильмов будут равны 0
const sortRating = mainCards.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
const sortComment = mainCards.slice().sort((a, b) => b.filmInfo.comment - a.filmInfo.comment);


// const isRatingSame = sortRating.every((card) => sortRating[0].filmInfo.rating === card.filmInfo.rating);

const isCommentSame = sortComment.every((card) => sortRating[0].filmInfo.comment === card.filmInfo.comment);

const isRatingSame = sortRating.every((card) => card.filmInfo.rating === 0);


console.log(isRatingSame);
console.log(isCommentSame);
