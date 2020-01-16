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

    this._activateHandler = this._activateHandler.bind(this);
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
    this._activateHandler(this._filterChangeHandlers);
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((it) => it.filmInfo.id === id);

    if (index === this._NO_ELEMENT) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(ZERO, index), movie, this._movies.slice(index + ONE));
    this._activateHandler(this._dataChangeHandlers);

    return true;
  }

  deleteComment(idMovie, idComment) {
    let isSuccess = false;

    this._movies.map((it) => {
      if (it.filmInfo.id === idMovie) {
        isSuccess = true;
        const index = it.filmInfo.commentUsers.findIndex((comment) => {
          return Number(comment.id) === idComment;
        });

        it.filmInfo.commentUsers.splice(index, ONE);
      }
    });

    return isSuccess;
  }

  // установка обработчика изменения активного фильта
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _activateHandler(handlers) {
    handlers.forEach((handler) => handler());
  }
}
