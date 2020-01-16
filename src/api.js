import Movie from './models/movie.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatus = {
  SUCCESS: 200,
  REDIRECTION: 300,
  CLIENT_ERROR: 400,
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.SUCCESS && response.status < ResponseStatus.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(id) {
    return this._load({url: `/comments/${id}`})
      .then((response) => response.json());
  }

  createMovie(movie) {
  }

  updateMovie(id, movieData) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(movieData.toRAW(movieData)),
      headers: new Headers({'Content-Type': `application/json`})
    })
        .then((response) => response.json())
        .then(Movie.parseMovie);
  }

  deleteMovie(id) {
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
