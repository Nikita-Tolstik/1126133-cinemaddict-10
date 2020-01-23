import Movie from './models/movie.js';

const TEXT_AUTHORIZATION = `Authorization`;
const CONTENT_TYPE = `application/json`;

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

const UrlEnd = {
  MOVIES: `movies/`,
  COMMENTS: `comments/`
};


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: UrlEnd.MOVIES})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(id) {
    return this._load({url: `${UrlEnd.COMMENTS}${id}`})
      .then((response) => response.json());
  }

  updateMovie(id, movieData) {
    return this._load({
      url: `${UrlEnd.MOVIES}${id}`,
      method: Method.PUT,
      body: JSON.stringify(movieData.toRAW(movieData)),
      headers: new Headers({'Content-Type': CONTENT_TYPE})
    })
        .then((response) => response.json())
        .then(Movie.parseMovie);
  }

  createComment(id, localComment) {

    return this._load({
      url: `${UrlEnd.COMMENTS}${id}`,
      method: Method.POST,
      body: JSON.stringify(localComment),
      headers: new Headers({'Content-Type': CONTENT_TYPE})
    })
      .then((response) => response.json());


  }

  deleteComment(id) {
    return this._load({
      url: `${UrlEnd.COMMENTS}${id}`,
      method: Method.DELETE,
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(TEXT_AUTHORIZATION, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
