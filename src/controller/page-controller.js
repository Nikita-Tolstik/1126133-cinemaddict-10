import NoMoviesComponent from '../components/no-movies.js';
import FilmsListComponent from '../components/films-list.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortMenuComponent, {SortType} from '../components/sort-menu.js';
import MovieController from './movie-controller.js';
import {ZERO, ONE, Feature} from '../const.js';
import {render, RenderPosition, remove} from '../utils/render.js';


const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;

const bodyElement = document.querySelector(`body`);


// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const renderExtraFilmBlock = (cards, feature, blockElement, extraElement) => {

  if (cards.length > ONE) {

    const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
    const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

    if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
      extraElement.remove();
    } else if (isSame) {
      let sameCards = [];
      sameCards.push(cards.slice().shift());
      sameCards.push(cards.slice().pop());

      renderCards(blockElement, sameCards);
    } else {
      renderCards(blockElement, sortCards.slice(ZERO, TWO));
    }

  } else {
    extraElement.remove();
  }
};

// Отрисовка карточек
const renderCards = (container, cards) => {
  cards.forEach((card) => {

    const movieController = new MovieController(container);

    movieController.render(card);
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();
  }

  render(cards) {


    const renderLoadMoreButton = () => {

      if (showingCardCount >= cards.length) {
        return;
      }

      // Обработчик на кнопке показать еще
      this._loadMoreButtonComponent.setOnClickLoadMoreButton(() => {

        const prevCardCount = showingCardCount;
        showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;


        renderCards(filmsListElements[ZERO], cards.slice(prevCardCount, showingCardCount));

        if (showingCardCount >= cards.length) {
          remove(this._loadMoreButtonComponent);
        }

      });

      render(filmsListElements[ZERO], this._loadMoreButtonComponent, RenderPosition.AFTER);
    };

    const isNoMovies = cards.length === ZERO;

    if (isNoMovies) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);

    const filmsListElements = this._filmsListComponent.getElement().querySelectorAll(`.films-list__container`);
    let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

    renderCards(filmsListElements[ZERO], cards.slice(ZERO, showingCardCount));
    renderLoadMoreButton();

    // Обработчик события на сортировку
    this._sortMenuComponent.onSetSortTypeChange((sortType) => {

      let sortedFilms = [];

      switch (sortType) {
        case SortType.DATE:
          sortedFilms = cards.slice().sort((a, b) => b.filmInfo.date - a.filmInfo.date);
          break;
        case SortType.RATING:
          sortedFilms = cards.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
          break;
        case SortType.DEFAULT:
          sortedFilms = cards.slice(ZERO, SHOWING_CARDS_COUNT_ON_START);
          break;
      }

      filmsListElements[ZERO].innerHTML = ``;

      renderCards(filmsListElements[ZERO], sortedFilms);

      if (sortType === SortType.DEFAULT) {
        showingCardCount = SHOWING_CARDS_COUNT_ON_START;
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreButtonComponent);
      }
    });


    const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics p`);
    footerStatisticsElement.textContent = `${cards.length} movies inside`;


    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    const blockFilmElements = document.querySelectorAll(`.films-list__container`);
    const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

    const topRatedElement = blockFilmElements[ONE];
    const extraTopRatedElement = extraFilmElement[ZERO];

    const mostCommentedElement = blockFilmElements[TWO];
    const extraMostCommentedElement = extraFilmElement[ONE];


    renderExtraFilmBlock(cards, Feature.rating, topRatedElement, extraTopRatedElement);
    renderExtraFilmBlock(cards, Feature.comment, mostCommentedElement, extraMostCommentedElement);
  }
}
