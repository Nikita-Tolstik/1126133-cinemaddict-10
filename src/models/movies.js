import {ZERO, ONE} from '../const.js';
import {FilterType} from '../const.js';
import {getMoviesByFilter} from '../utils/filter.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._NO_ELEMENT = -1;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getAllMovies() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  // Активация фильтра
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((it) => it.filmInfo.id === id);

    if (index === this._NO_ELEMENT) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(ZERO, index), movie, this._movies.slice(index + ONE));
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  deleteComment(id) {

    this._movies.map((it) => {
      if (it.filmInfo.id === id) {
        it.filmInfo.commentUsers.splice(Number(document.querySelector(`.delete`).id), 1);
      }
    });
  }

  // установка обработчика изменения активного фильта
  setOnFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setOnDataChange(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
