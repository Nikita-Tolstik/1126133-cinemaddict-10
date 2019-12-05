import ProfileRatingComponent from './components/profile-rating.js';
import SiteMenuComponent from './components/site-menu.js';
import SortMenuComponent from './components/sort-menu.js';
import FilmsListComponent from './components/films-list.js';
import CardFilmComponent from './components/card-film.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import FilmDetailsPopupComponent from './components/film-details.js';
import {generateFilmCards} from './mock/card-film.js';
import {ZERO, ONE, Feature} from './const.js';
import {generateFilmDetails} from './mock/film-details.js';
import {render, renderExtraFilmBlock, RenderPosition} from './util.js';


const COUNT_MAIN_CARDS = 20;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;

const mainCards = generateFilmCards(COUNT_MAIN_CARDS);
const FilmDetailsPopup = generateFilmDetails();


const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileRatingComponent().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListComponent();
render(siteMainElement, filmsListComponent.getElement(), RenderPosition.BEFOREEND);


const filmsListElements = filmsListComponent.getElement().querySelectorAll(`.films-list__container`);


let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

mainCards.slice(ZERO, showingCardCount).forEach((card) => render(filmsListElements[ZERO], new CardFilmComponent(card).getElement(), RenderPosition.BEFOREEND));

const loadMoreButtonComponent = new LoadMoreButtonComponent();
render(filmsListElements[ZERO], loadMoreButtonComponent.getElement(), RenderPosition.AFTER);

// Попап
const bodyElement = document.querySelector(`body`);
render(bodyElement, new FilmDetailsPopupComponent(FilmDetailsPopup).getElement(), RenderPosition.BEFOREEND);


// Обработчик на кнопке показать еще
loadMoreButtonComponent.getElement().addEventListener(`click`, () => {

  const prevCardCount = showingCardCount;
  showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

  mainCards.slice(prevCardCount, showingCardCount).forEach((card) => render(filmsListElements[ZERO], new CardFilmComponent(card).getElement(), RenderPosition.BEFOREEND));


  if (showingCardCount >= mainCards.length) {
    loadMoreButtonComponent.getElement().remove();
    loadMoreButtonComponent.removeElement();
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
