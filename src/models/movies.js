import {ZERO, ONE} from '../const.js';

export default class Movies {
  constructor() {
    this._movies = [];

    this._NO_ELEMENT = -1;
  }

  getMovies() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((it) => it.filmInfo.id === id);

    if (index === this._NO_ELEMENT) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(ZERO, index), movie, this._movies.slice(index + ONE));

    return true;
  }
}
