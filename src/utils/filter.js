import {FilterType} from '../const.js';

export const getWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.isWatchlist);
};

export const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.isWatched);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.isFavorite);
};

export const getMoviesByFilter = (movies, filterType) => {

  let filteredMovies = [];

  switch (filterType) {

    case FilterType.ALL:
      filteredMovies = movies;
      break;
    case FilterType.WATCHLIST:
      filteredMovies = getWatchlistMovies(movies);
      break;
    case FilterType.WATCHED:
      filteredMovies = getWatchedMovies(movies);
      break;
    case FilterType.FAVORITE:
      filteredMovies = getFavoriteMovies(movies);
      break;
  }

  return filteredMovies;
};


