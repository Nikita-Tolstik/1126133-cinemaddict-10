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
const NO_ELEMENT = -1;

const bodyElement = document.querySelector(`body`);


// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const renderExtraFilmBlock = (cards, feature, blockElement, extraElement, onDataChange) => {

  if (cards.length > ONE) {

    const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
    const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

    if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
      extraElement.remove();
    } else if (isSame) {
      let sameCards = [];
      sameCards.push(cards.slice().shift());
      sameCards.push(cards.slice().pop());

      renderCards(blockElement, sameCards, onDataChange);
    } else {
      renderCards(blockElement, sortCards.slice(ZERO, TWO), onDataChange);
    }

  } else {
    extraElement.remove();
  }
};

// Отрисовка карточек
const renderCards = (container, cards, onDataChange) => {
  cards.forEach((card) => {

    const movieController = new MovieController(container, onDataChange);

    movieController.render(card);
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._cards = [];

    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(cards) {

    this._cards = cards;

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

    renderCards(filmsListElements[ZERO], cards.slice(ZERO, showingCardCount), this._onDataChange);
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

      renderCards(filmsListElements[ZERO], sortedFilms, this._onDataChange);

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


    renderExtraFilmBlock(cards, Feature.rating, topRatedElement, extraTopRatedElement, this._onDataChange);
    renderExtraFilmBlock(cards, Feature.comment, mostCommentedElement, extraMostCommentedElement, this._onDataChange);
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((card) => card === oldData);

    if (index === NO_ELEMENT) {
      return;
    }

    this._cards = [].concat(this._cards.slice(ZERO, index), newData, this._cards.slice(index + ONE));

    movieController.render(this._cards[index]);
  }
}
