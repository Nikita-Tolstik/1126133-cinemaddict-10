export default class Movie {
  constructor(movieData) {
    this.filmInfo = {
      id: movieData[`id`],
      title: movieData[`film_info`][`title`],
      originalTitle: movieData[`film_info`][`alternative_title`],
      image: movieData[`film_info`][`poster`],
      description: movieData[`film_info`][`description`],
      rating: movieData[`film_info`][`total_rating`],
      date: new Date(movieData[`film_info`][`release`][`date`]).getTime(),
      time: movieData[`film_info`][`runtime`],
      genres: movieData[`film_info`][`genre`],
      commentUsers: Array.isArray(movieData[`comments`]) ? movieData[`comments`] : [],
      age: movieData[`film_info`][`age_rating`],
      actors: movieData[`film_info`][`actors`],
      director: movieData[`film_info`][`director`],
      writers: movieData[`film_info`][`writers`],
      country: movieData[`film_info`][`release`][`release_country`],
    };

    this.userDetails = {
      personalRating: movieData[`user_details`][`personal_rating`],
      isWatchlist: movieData[`user_details`][`watchlist`],
      isWatched: movieData[`user_details`][`already_watched`],
      isFavorite: movieData[`user_details`][`favorite`],
      watchedDate: movieData[`user_details`][`watching_date`] || null,
    };
  }

  // Комментарии проверить, возможно не получиться отправить на сервер
  toRAW(movie) {
    return {
      'id': this.filmInfo.id,
      'comments': movie.filmInfo.commentUsers.map((com) => {
        return com.id ? com.id : com;
      }),
      'film_info': {
        'title': this.filmInfo.title,
        'alternative_title': this.filmInfo.originalTitle,
        'total_rating': this.filmInfo.rating,
        'poster': this.filmInfo.image,
        'age_rating': this.filmInfo.age,
        'director': this.filmInfo.director,
        'writers': this.filmInfo.writers,
        'actors': this.filmInfo.actors,
        'release': {
          'date': this.filmInfo.date ? new Date(this.filmInfo.date).toISOString() : new Date(0).toISOString(),
          'release_country': this.filmInfo.country
        },
        'runtime': this.filmInfo.time,
        'genre': this.filmInfo.genres,
        'description': this.filmInfo.description
      },
      'user_details': {
        'personal_rating': this.userDetails.personalRating,
        'watchlist': this.userDetails.isWatchlist,
        'already_watched': this.userDetails.isWatched,
        'watching_date': this.userDetails.watchedDate,
        'favorite': this.userDetails.isFavorite
      }
    };
  }

  static parseMovie(movie) {
    return new Movie(movie);
  }

  static parseMovies(movies) {
    return movies.map(Movie.parseMovie);
  }

  static clone(movie) {
    return new Movie(movie.toRAW(movie));
  }
}
