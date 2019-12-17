import NoMoviesComponent from '../components/no-movies.js';
import FilmsListComponent from '../components/films-list.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortMenuComponent, {SortType} from '../components/sort-menu.js';
import MovieController from './movie-controller.js';
import {ZERO, ONE, Feature} from '../const.js';
import {render, RenderPosition, remove} from '../utils/render.js';


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

    this._SHOWING_CARDS_COUNT_ON_START = 5;
    this._SHOWING_CARDS_COUNT_BY_BUTTON = 5;
    this._TWO = 2;
    this._NO_ELEMENT = -1;

    this._cards = [];
    this._showedMovieControllers = [];
    this._showingCardCount = this._SHOWING_CARDS_COUNT_ON_START;

    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    // Обработчик события на сортировку
    this._sortMenuComponent.onSetSortTypeChange(this._onSortTypeChange);

    this._renderExtraFilmBlock = this._renderExtraFilmBlock;
    this._renderLoadMoreButton = this._renderLoadMoreButton;

    this._bodyElement = document.querySelector(`body`);
    this._filmsListElements = null;
  }

  render(cards) {

    this._cards = cards;


    const isNoMovies = this._cards.length === ZERO;

    if (isNoMovies) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._filmsListElements = this._filmsListComponent.getElement().querySelectorAll(`.films-list__container`);


    const newCards = renderCards(this._filmsListElements[ZERO], cards.slice(ZERO, this._showingCardCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);

    this._renderLoadMoreButton();

    // Отображение кол-ва фильмов
    const footerStatisticsElement = this._bodyElement.querySelector(`.footer__statistics p`);
    footerStatisticsElement.textContent = `${this._cards.length} movies inside`;


    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    const blockFilmElements = document.querySelectorAll(`.films-list__container`);
    const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

    const topRatedElement = blockFilmElements[ONE];
    const extraTopRatedElement = extraFilmElement[ZERO];

    const mostCommentedElement = blockFilmElements[this._TWO];
    const extraMostCommentedElement = extraFilmElement[ONE];


    this._renderExtraFilmBlock(cards, Feature.rating, topRatedElement, extraTopRatedElement, this._onDataChange, this._onViewChange);
    this._renderExtraFilmBlock(cards, Feature.comment, mostCommentedElement, extraMostCommentedElement, this._onDataChange, this._onViewChange);
  }

  // Реагирует на изменения Данных пользователем, отрисовывает новый компонент
  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((card) => card === oldData);

    if (index === this._NO_ELEMENT) {
      return;
    }

    this._cards = [].concat(this._cards.slice(ZERO, index), newData, this._cards.slice(index + ONE));

    movieController.render(this._cards[index]);
  }

  // Закрывает уже открытый Попап, если открывают ещё один
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
        renderCards(blockElement, sortCards.slice(ZERO, this._TWO), onDataChange, onViewChange);
      }

    } else {
      extraElement.remove();
    }
  }

  // Отрисовка кнопки - show more
  _renderLoadMoreButton() {

    if (this._showingCardCount >= this._cards.length) {
      return;
    }

    // Обработчик на кнопке показать еще
    this._loadMoreButtonComponent.setOnClickLoadMoreButton(() => {

      const prevCardCount = this._showingCardCount;
      this._showingCardCount = this._showingCardCount + this._SHOWING_CARDS_COUNT_BY_BUTTON;


      const newCards = renderCards(this._filmsListElements[ZERO], this._cards.slice(prevCardCount, this._showingCardCount), this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newCards);

      if (this._showingCardCount >= this._cards.length) {
        remove(this._loadMoreButtonComponent);
      }

    });

    render(this._filmsListElements[ZERO], this._loadMoreButtonComponent, RenderPosition.AFTER);
  }

  // Сортировка фильмов в зависимости от выбранного типа
  _onSortTypeChange(sortType) {

    let sortedFilms = [];

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = this._cards.slice().sort((a, b) => b.filmInfo.date - a.filmInfo.date);
        break;
      case SortType.RATING:
        sortedFilms = this._cards.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = this._cards.slice(ZERO, this._SHOWING_CARDS_COUNT_ON_START);
        break;
    }

    this._filmsListElements[ZERO].innerHTML = ``;

    const newSortCards = renderCards(this._filmsListElements[ZERO], sortedFilms, this._onDataChange, this._onViewChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newSortCards);

    if (sortType === SortType.DEFAULT) {
      this._showingCardCount = this._SHOWING_CARDS_COUNT_ON_START;
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
