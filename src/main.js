import {createProfileRatingTemplate} from './components/profile-rating.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createCardFilmTemplate} from './components/card-film.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {generateFilmCards} from './mock/card-film.js';
import {ZERO, ONE, Feature} from './const.js';
import {generateFilmDetails} from './mock/film-details.js';
import {createFilmDetailsPopupTemplate} from './components/film-details.js';
import {render, renderExtraFilmBlock} from './util.js';


const COUNT_MAIN_CARDS = 20;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;

const mainCards = generateFilmCards(COUNT_MAIN_CARDS);
const FilmDetailsPopup = generateFilmDetails();


const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileRatingTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const filmsListElements = siteFilmsElement.querySelectorAll(`.films-list__container`);


let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

mainCards.slice(ZERO, showingCardCount).forEach((card) => render(filmsListElements[ZERO], createCardFilmTemplate(card), `beforeend`));


render(filmsListElements[ZERO], createLoadMoreButtonTemplate(), `afterend`);

// Попап
const bodyElement = document.querySelector(`body`);
render(bodyElement, createFilmDetailsPopupTemplate(FilmDetailsPopup), `beforeend`);

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

// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics p`);
footerStatisticsElement.textContent = `${mainCards.length} movies inside`;

const blockFilmElements = document.querySelectorAll(`.films-list__container`);
const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

const topRatedElement = blockFilmElements[ONE];
const extraTopRatedElement = extraFilmElement[ZERO];

const mostCommentedElement = blockFilmElements[TWO];
const extraMostCommentedElement = extraFilmElement[ONE];


renderExtraFilmBlock(mainCards, Feature.rating, topRatedElement, extraTopRatedElement);
renderExtraFilmBlock(mainCards, Feature.comment, mostCommentedElement, extraMostCommentedElement);

export {mainCards};
