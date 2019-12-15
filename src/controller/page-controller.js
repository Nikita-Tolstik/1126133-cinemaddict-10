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


// Отрисовка карточек
const renderCards = (container, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(card);

    return movieController;
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._cards = [];

    this._showedMovieControllers = [];
    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._renderExtraFilmBlock = this._renderExtraFilmBlock;

    this._bodyElement = document.querySelector(`body`);
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


        const newCards = renderCards(filmsListElements[ZERO], cards.slice(prevCardCount, showingCardCount), this._onDataChange, this._onViewChange);
        this._showedMovieControllers = this._showedMovieControllers.concat(newCards);

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

    const newCards = renderCards(filmsListElements[ZERO], cards.slice(ZERO, showingCardCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);


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

      const newSortCards = renderCards(filmsListElements[ZERO], sortedFilms, this._onDataChange, this._onViewChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newSortCards);

      if (sortType === SortType.DEFAULT) {
        showingCardCount = SHOWING_CARDS_COUNT_ON_START;
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreButtonComponent);
      }
    });


    const footerStatisticsElement = this._bodyElement.querySelector(`.footer__statistics p`);
    footerStatisticsElement.textContent = `${cards.length} movies inside`;


    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    const blockFilmElements = document.querySelectorAll(`.films-list__container`);
    const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

    const topRatedElement = blockFilmElements[ONE];
    const extraTopRatedElement = extraFilmElement[ZERO];

    const mostCommentedElement = blockFilmElements[TWO];
    const extraMostCommentedElement = extraFilmElement[ONE];


    this._renderExtraFilmBlock(cards, Feature.rating, topRatedElement, extraTopRatedElement, this._onDataChange, this._onViewChange);
    this._renderExtraFilmBlock(cards, Feature.comment, mostCommentedElement, extraMostCommentedElement, this._onDataChange, this._onViewChange);
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((card) => card === oldData);

    if (index === NO_ELEMENT) {
      return;
    }

    this._cards = [].concat(this._cards.slice(ZERO, index), newData, this._cards.slice(index + ONE));

    movieController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }


  // Отсортировка фильмов в блоки самые комментированные и рейтинговые
  _renderExtraFilmBlock(cards, feature, blockElement, extraElement, onDataChange, onViewChange) {

    if (cards.length > ONE) {

      const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
      const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

      if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
        extraElement.remove();
      } else if (isSame) {
        let sameCards = [];
        sameCards.push(cards.slice().shift());
        sameCards.push(cards.slice().pop());

        renderCards(blockElement, sameCards, onDataChange, onViewChange);
      } else {
        renderCards(blockElement, sortCards.slice(ZERO, TWO), onDataChange, onViewChange);
      }

    } else {
      extraElement.remove();
    }
  }
}
