export default class Movie {
  constructor(data) {
    this.filmInfo = {
      id: data[`id`],
      title: data[`film_info`][`title`],
      originalTitle: data[`film_info`][`alternative_title`],
      image: data[`film_info`][`poster`],
      description: data[`film_info`][`description`],
      rating: data[`film_info`][`total_rating`],
      date: new Date(data[`film_info`][`release`][`date`]).getTime(),
      time: data[`film_info`][`runtime`],
      genres: data[`film_info`][`genre`],
      commentUsers: Array.isArray(data[`comments`]) ? data[`comments`] : [],
      age: data[`film_info`][`age_rating`],
      actors: data[`film_info`][`actors`],
      director: data[`film_info`][`director`],
      writers: data[`film_info`][`writers`],
      country: data[`film_info`][`release`][`release_country`],
    };

    this.userDetails = {
      personalRating: data[`user_details`][`personal_rating`],
      isWatchlist: data[`user_details`][`watchlist`],
      isWatched: data[`user_details`][`already_watched`],
      isFavorite: data[`user_details`][`favorite`],
      watchedDate: data[`user_details`][`watching_date`] || null,
    };
  }

  // Комментарии проверить, возможно не получиться отправить на сервер
  toRAW(data) {
    return {
      'id': this.filmInfo.id,
      'comments': data.filmInfo.commentUsers.map((com) => {
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

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW(data));
  }
}
