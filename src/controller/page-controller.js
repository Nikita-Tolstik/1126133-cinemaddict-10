import ProfileRatingComponent from '../components/profile-rating.js';
import NoMoviesComponent from '../components/no-movies.js';
import FilmsListComponent from '../components/films-list.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortMenuComponent, {SortType} from '../components/sort-menu.js';
import MovieController from './movie-controller.js';
import {ZERO, ONE, Feature, TagName} from '../const.js';
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
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._SHOWING_CARDS_COUNT_ON_START = 5;
    this._SHOWING_CARDS_COUNT_BY_BUTTON = 5;
    this._TWO = 2;


    this._showedMovieControllers = [];
    this._showingMovieCount = this._SHOWING_CARDS_COUNT_ON_START;

    this._profileRatingComponent = new ProfileRatingComponent(this._moviesModel);
    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);


    // Обработчик события на сортировку
    this._sortMenuComponent.setOnSortTypeChange(this._onSortTypeChange);

    // Обработчик смены фильтра и активации методов перерисовки
    this._moviesModel.setOnFilterChange(this._onFilterChange);

    this._bodyElement = document.querySelector(TagName.BODY);
    this._filmsListElements = null;
  }

  // Отображение списка фильмов и меню сортировки
  show() {
    this._filmsListComponent.show();
    this._sortMenuComponent.show();

    if (this._moviesModel.getMovies().length === ZERO) {
      this._noMoviesComponent.show();
    }
  }

  // Скрытие списка фильмов и меню сортировки
  hide() {
    this._filmsListComponent.hide();
    this._sortMenuComponent.hide();

    if (this._moviesModel.getMovies().length === ZERO) {
      this._noMoviesComponent.hide();
    }
  }

  render() {
    const movies = this._moviesModel.getMovies();
    const isNoMovies = this._moviesModel.getMovies().length === ZERO;

    const siteHeaderElement = document.querySelector(`.${TagName.HEADER}`);
    render(siteHeaderElement, this._profileRatingComponent, RenderPosition.BEFOREEND);

    if (isNoMovies) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }


    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._filmsListElements = this._filmsListComponent.getElement().querySelectorAll(`.films-list__container`);

    this._renderMovies(movies.slice(ZERO, this._showingMovieCount));
    this._renderLoadMoreButton();

    // Отображение кол-ва фильмов
    const footerStatisticsElement = this._bodyElement.querySelector(`.footer__statistics p`);
    footerStatisticsElement.textContent = `${movies.length} movies inside`;

    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    this._renderExtraFilmBlock(movies, Feature.rating, this._onDataChange, this._onViewChange);
    this._renderExtraFilmBlock(movies, Feature.comment, this._onDataChange, this._onViewChange);
  }

  _removeMovies() {
    this._filmsListElements[ZERO].innerHTML = ``;
    this._showedMovieControllers = [];
  }

  _renderMovies(movies) {
    const newCards = renderCards(this._filmsListElements[ZERO], movies, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    this._showingMovieCount = this._showedMovieControllers.length;
  }

  // Реагирует на изменения Данных пользователем, отрисовывает новый компонент
  _onDataChange(movieController, oldData, newData) {

    if (newData === null) { // Удаление комментария
      this._moviesModel.deleteComment(oldData.filmInfo.id);
      this._updateMoviesList();

    } else if (oldData === null) { // Добавление комментария
      const isSuccess = this._moviesModel.addComment(newData.filmInfo.id, newData);
      if (isSuccess) {
        movieController.render(newData);
        this._updateMoviesList();
      }

    } else { // Просто обновление данных фильма

      this._api.updateMovie(oldData.filmInfo.id, newData)
        .then((newMovieModel) => {
          newMovieModel.filmInfo.commentUsers = oldData.filmInfo.commentUsers;
          const isSuccess = this._moviesModel.updateMovies(oldData.filmInfo.id, newMovieModel);

          if (isSuccess) {
            movieController.render(newMovieModel);
            this._updateMoviesList();
          }
        });
    }
  }

  // Моментальное Обновление списка фильмов после отметки фильма Watched, Watchlist, Favorite.
  // А также обновление карточек фильмов в Блоках Top Rated и Most commented
  _updateMoviesList() {
    this._removeMovies();
    this._onSortTypeChange(this._sortMenuComponent.getElement().querySelector(`.sort__button--active`).dataset.sortType, true);

    const blockFilmElements = document.querySelectorAll(`.films-list__container`);
    blockFilmElements[this._TWO].innerHTML = ``;
    blockFilmElements[ONE].innerHTML = ``;

    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    this._renderExtraFilmBlock(this._moviesModel.getAllMovies(), Feature.rating, this._onDataChange, this._onViewChange);
    this._renderExtraFilmBlock(this._moviesModel.getAllMovies(), Feature.comment, this._onDataChange, this._onViewChange);

    // обновление звания пользователя при изменении списка просмотренных фильмов
    this._profileRatingComponent.rerender();
  }

  // Закрывает уже открытый Попап, если открывают ещё один
  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  // Отсортировка фильмов в блоки самые комментированные и рейтинговые
  _renderExtraFilmBlock(cards, feature, onDataChange, onViewChange) {

    // Отсортировка фильмов в блоки самые комментированные и рейтинговые
    const blockFilmElements = document.querySelectorAll(`.films-list__container`);
    const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

    let extraElement = null;
    let blockElement = null;

    switch (feature) {
      case Feature.comment:
        extraElement = extraFilmElement[ONE];
        blockElement = blockFilmElements[this._TWO];
        break;
      case Feature.rating:
        extraElement = extraFilmElement[ZERO];
        blockElement = blockFilmElements[ONE];
    }

    if (cards.length > ONE) {

      let sortCards = null;
      let isSame = null;
      let isAllZero = null;

      if (Array.isArray(cards[ZERO].filmInfo[feature])) {

        sortCards = cards.slice().sort((a, b) => b.filmInfo[feature].length - a.filmInfo[feature].length);
        isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature].length === card.filmInfo[feature].length);
        isAllZero = sortCards[ZERO].filmInfo[feature].length === ZERO;

      } else {

        sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
        isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);
        isAllZero = sortCards[ZERO].filmInfo[feature] === ZERO;
      }

      if (isSame && isAllZero) {
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
    remove(this._loadMoreButtonComponent);


    if (this._showingMovieCount >= this._moviesModel.getMovies().length) {
      return;
    }

    render(this._filmsListElements[ZERO], this._loadMoreButtonComponent, RenderPosition.AFTER);

    // Обработчик на кнопке показать еще
    this._loadMoreButtonComponent.setOnClickLoadMoreButton(this._onLoadMoreButtonClick);
  }

  // Сортировка фильмов в зависимости от выбранного типа
  _onSortTypeChange(sortType, isUpdate) {

    let sortedFilms = [];
    const movies = this._moviesModel.getMovies();

    let quantity = null;

    if (isUpdate) {
      quantity = this._showingMovieCount;
    } else {
      quantity = this._SHOWING_CARDS_COUNT_ON_START;
    }

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = movies.slice().sort((a, b) => b.filmInfo.date - a.filmInfo.date);
        break;
      case SortType.RATING:
        sortedFilms = movies.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = movies.slice(ZERO, quantity);
        break;
    }

    this._removeMovies();
    this._renderMovies(sortedFilms);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onLoadMoreButtonClick() {
    const movies = this._moviesModel.getMovies();
    const prevMovieCount = this._showingMovieCount;

    this._showingMovieCount = this._showingMovieCount + this._SHOWING_CARDS_COUNT_BY_BUTTON;


    this._renderMovies(movies.slice(prevMovieCount, this._showingMovieCount));

    if (this._showingMovieCount >= movies.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  // активации методов при смене фильтра
  _onFilterChange() {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(ZERO, this._SHOWING_CARDS_COUNT_ON_START));
    this._renderLoadMoreButton();

    // При переключении фильтра - идёт сброс типа сортировки на дефолтное
    this._sortMenuComponent.resetSortType(this._sortMenuComponent.getElement(), this._sortMenuComponent.getElement().querySelector(TagName.A_SMALL));
    this._onSortTypeChange(SortType.DEFAULT);
  }
}
