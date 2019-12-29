import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';
import {getWatchlistMovies, getWatchedMovies, getFavoriteMovies} from '../utils/filter.js';
import {TagName} from '../const.js';

const createSiteMenuTemplate = (movies, activeFilter) => {


  const watchlistMoviesCount = getWatchlistMovies(movies).length;
  const watchedMoviesCount = getWatchedMovies(movies).length;
  const favoriteMoviesCount = getFavoriteMovies(movies).length;

  return (
    `<nav class="main-navigation">
      <a href="#all" data-filter-type="${FilterType.ALL}" class="main-navigation__item ${activeFilter === FilterType.ALL ? `main-navigation__item--active` : ``}">All movies</a>

      <a href="#watchlist" data-filter-type="${FilterType.WATCHLIST}" class="main-navigation__item ${activeFilter === FilterType.WATCHLIST ? `main-navigation__item--active` : ``}">Watchlist <span class="main-navigation__item-count">${watchlistMoviesCount}</span></a>

      <a href="#history" data-filter-type="${FilterType.WATCHED}" class="main-navigation__item ${activeFilter === FilterType.WATCHED ? `main-navigation__item--active` : ``}">History <span class="main-navigation__item-count">${watchedMoviesCount}</span></a>

      <a href="#favorites" data-filter-type="${FilterType.FAVORITE}" class="main-navigation__item ${activeFilter === FilterType.FAVORITE ? `main-navigation__item--active` : ``}">Favorites <span class="main-navigation__item-count">${favoriteMoviesCount}</span></a>

      <a href="#stats" data-filter-type="${FilterType.STATS}" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(movies, currentFilterType) {
    super();

    this._movies = movies;
    this._currentFilterType = currentFilterType;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._movies, this._currentFilterType);
  }

  setOnFilterChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== TagName.A || evt.target.dataset.filterType === FilterType.STATS) {
        return;
      }

      const filterName = evt.target.dataset.filterType;

      if (this._currentFilterType === filterName) {
        return;
      }

      this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);

      this._currentFilterType = filterName;

      handler(this._currentFilterType);
    });
  }
}
