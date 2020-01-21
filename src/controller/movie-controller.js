import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import MovieModel from '../models/movie.js';
import {KeyDown, TagName, ZERO, ElementClass} from '../const.js';
import {render, RenderPosition, removePopup, replace} from '../utils/render.js';


const RED_COLOR = `red`;
const TEXT_DELETE = `Delete`;
const STYLE_BORDER_COMMENT = `3px solid crimson`;
const SHAKE_CLASS = `shake`;

const TimeAnimation = {
  MIN: 600,
  MAX: 1000
};

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

const parseFormData = (formData) => {
  const dateComment = new Date().toISOString();
  const emoji = document.querySelector(`.film-details__emoji-list input:checked`).value;

  return {
    'comment': formData.get(`comment`),
    'date': dateComment,
    'emotion': emoji
  };
};


export default class MovieController {
  constructor(container, dataChangeHandler, viewChangeHandler) {

    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._cardFilmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._bodyElement = document.querySelector(TagName.BODY);
  }

  render(movie) {

    const oldCardFilmComponent = this._cardFilmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._cardFilmComponent = new CardFilmComponent(movie);
    this._filmPopupComponent = new FilmDetailsPopupComponent(movie);

    // Метод карточки - обработчик события кликов на элементы карточки
    this._cardFilmComponent.setClickCardElementsHandler(() => {
      this._switchCardToPopup();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._filmPopupComponent.setClickCloseButtonPopupHandler(() => {
      this._switchPopupToCard();
    });


    // Метод попапа - обработчик события клика на Watchlist
    this._filmPopupComponent.setWatchlistInputClickHandler(() => {

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isWatchlist = !newMovie.userDetails.isWatchlist;

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Метод попапа - обработчик события клика на Watched
    this._filmPopupComponent.setWatchedInputClickHandler(() => {
      const isWatchedMovie = movie.userDetails.isWatched;

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = isWatchedMovie ? 0 : 0;
      newMovie.userDetails.isWatched = !newMovie.userDetails.isWatched;
      newMovie.userDetails.watchedDate = isWatchedMovie ? new Date().toISOString(ZERO) : new Date().toISOString();

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Метод попапа - обработчик события клика на Favorite
    this._filmPopupComponent.setFavoriteInputClickHandler(() => {

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isFavorite = !newMovie.userDetails.isFavorite;

      this._dataChangeHandler(this, movie, newMovie);
    });


    // Метод карточки - обработчик события клика на Watchlist
    this._cardFilmComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isWatchlist = !newMovie.userDetails.isWatchlist;

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();

      const isWatchedMovie = movie.userDetails.isWatched;

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = isWatchedMovie ? 0 : 0;
      newMovie.userDetails.isWatched = !newMovie.userDetails.isWatched;
      newMovie.userDetails.watchedDate = isWatchedMovie ? new Date().toISOString(ZERO) : new Date().toISOString();

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Метод карточки - обработчик события клика Favorite
    this._cardFilmComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isFavorite = !newMovie.userDetails.isFavorite;

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Удаление комментария
    this._filmPopupComponent.setClickDeleteCommentButtonHandler(() => {
      this._dataChangeHandler(this, movie, null);
    });

    // Добавление нового комментрария
    this._filmPopupComponent.setFormSubmitHandler(() => {

      const formData = this._filmPopupComponent.getFormData();
      const newComment = parseFormData(formData);


      const newMovie = MovieModel.clone(movie);
      newMovie.filmInfo.commentUsers = newComment;

      this._dataChangeHandler(this, null, newMovie);
    });

    // Выбор рейтинга
    this._filmPopupComponent.setClickRatingInputHandler((rating) => {

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = Number(rating);

      this._dataChangeHandler(this, movie, newMovie);
    });

    // Сброс рейтинга на кнопку Undo
    this._filmPopupComponent.setClickUndoButtonHandler(() => {

      if (movie.userDetails.personalRating === ZERO) {
        return;
      }

      const newMovie = MovieModel.clone(movie);

      newMovie.userDetails.personalRating = ZERO;
      this._dataChangeHandler(this, movie, newMovie);
    });

    if (oldCardFilmComponent && oldFilmPopupComponent) {

      replace(this._cardFilmComponent, oldCardFilmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._cardFilmComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchPopupToCard();
    }
  }

  _switchPopupToCard() {

    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._filmPopupComponent.resetSmile();

    removePopup(this._filmPopupComponent);
    this._mode = Mode.DEFAULT;
  }

  _switchCardToPopup() {
    this._viewChangeHandler();

    render(this._bodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
  }

  _escKeyDownHandler(evt) {
    const isEscDown = evt.key === KeyDown.ESCAPE || evt.key === KeyDown.ESC;

    if (isEscDown) {
      this._switchPopupToCard();
    }
  }

  catchAddCommentError() {
    this._filmPopupComponent.getElement().querySelector(`.film-details__comment-input`).disabled = false;
    this._filmPopupComponent.getElement().querySelector(`.film-details__comment-input`).style.border = STYLE_BORDER_COMMENT;
  }

  catchDeleteCommentError() {
    this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list .${ElementClass.DELETE} button`).textContent = TEXT_DELETE;
    this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list .${ElementClass.DELETE} button`).disabled = false;
  }

  catchRatingError() {
    if (this._filmPopupComponent.getElement().querySelector(`.form-details__middle-container`)) {

      this._filmPopupComponent.setColorScore(RED_COLOR);
      this._filmPopupComponent.setDisableScore(false);
    }
  }

  shake(classElement) {

    if (this._filmPopupComponent.getElement().querySelector(`.film-details__${classElement}`)) {

      this._filmPopupComponent.getElement().querySelector(`.film-details__${classElement}`).style.animation = `${SHAKE_CLASS} ${TimeAnimation.MIN / TimeAnimation.MAX}s`;

      setTimeout(() => {
        this._filmPopupComponent.getElement().querySelector(`.film-details__${classElement}`).style.animation = ``;
      }, TimeAnimation.MIN);
    }
  }
}

