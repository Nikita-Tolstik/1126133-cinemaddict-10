import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import MovieModel from '../models/movie.js';
import {KeyDown, TagName, ZERO} from '../const.js';
import {render, RenderPosition, removePopup, replace} from '../utils/render.js';
import clonedeep from 'lodash.clonedeep';


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
  constructor(container, onDataChange, onViewChange) {

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

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
    this._cardFilmComponent.setOnClickCardElements(() => {
      this._switchCardToPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmPopupComponent.setOnClickCloseButtonPopup(() => {
      this._switchPopupToCard();
    });


    // Метод попапа - обработчик события клика на Watchlist
    this._filmPopupComponent.setOnWatchlistInputClick(() => {

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isWatchlist = !newMovie.userDetails.isWatchlist;

      this._onDataChange(this, movie, newMovie);
    });

    // Метод попапа - обработчик события клика на Watched
    this._filmPopupComponent.setOnWatchedInputClick(() => {
      const isWatchedMovie = movie.userDetails.isWatched;

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = isWatchedMovie ? 0 : 0;
      newMovie.userDetails.isWatched = !newMovie.userDetails.isWatched;
      newMovie.userDetails.watchedDate = isWatchedMovie ? new Date().toISOString(ZERO) : new Date().toISOString();

      this._onDataChange(this, movie, newMovie);
    });

    // Метод попапа - обработчик события клика на Favorite
    this._filmPopupComponent.setOnFavoriteInputClick(() => {

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isFavorite = !newMovie.userDetails.isFavorite;

      this._onDataChange(this, movie, newMovie);
    });


    // Метод карточки - обработчик события клика на Watchlist
    this._cardFilmComponent.setOnWatchlistButtonClick((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isWatchlist = !newMovie.userDetails.isWatchlist;

      this._onDataChange(this, movie, newMovie);
    });

    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setOnWatchedButtonClick((evt) => {
      evt.preventDefault();

      const isWatchedMovie = movie.userDetails.isWatched;

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = isWatchedMovie ? 0 : 0;
      newMovie.userDetails.isWatched = !newMovie.userDetails.isWatched;
      newMovie.userDetails.watchedDate = isWatchedMovie ? new Date().toISOString(ZERO) : new Date().toISOString();

      this._onDataChange(this, movie, newMovie);
    });

    // Метод карточки - обработчик события клика Favorite
    this._cardFilmComponent.setOnFavoriteButtonClick((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.isFavorite = !newMovie.userDetails.isFavorite;

      this._onDataChange(this, movie, newMovie);
    });

    // Удаление комментария
    this._filmPopupComponent.setOnClickDeleteCommentButton(() => {
      this._onDataChange(this, movie, null);
    });

    // Добавление нового комментрария
    this._filmPopupComponent.setOnFormSubmit(() => {

      const formData = this._filmPopupComponent.getFormData();
      const newComment = parseFormData(formData);
      const cloneMovie = clonedeep(movie);

      const id = {
        id: cloneMovie.filmInfo.id,
        author: `Nikita`,
      };

      const newComments = [Object.assign({}, id, newComment)];
      const oldComments = cloneMovie.filmInfo.commentUsers;
      const concatNewComments = [].concat(newComments, oldComments);

      cloneMovie.filmInfo.commentUsers = concatNewComments;

      this._onDataChange(this, null, clonedeep(cloneMovie));
    });

    // Выбор рейтинга
    this._filmPopupComponent.setOnClickRatingInput((rating) => {
      if (movie.userDetails.personalRating !== ZERO) {

        [...document.querySelectorAll(`.film-details__user-rating-score input`)].forEach((input) => {
          input.classList.add(`disabled`);
        });

        return;
      }

      const newMovie = MovieModel.clone(movie);
      newMovie.userDetails.personalRating = Number(rating);

      this._onDataChange(this, movie, newMovie);
    });

    // Сброс рейтинга на кнопку Undo
    this._filmPopupComponent.setOnClickUndoButton(() => {

      if (movie.userDetails.personalRating === ZERO) {
        return;
      }

      const newMovie = MovieModel.clone(movie);

      newMovie.userDetails.personalRating = ZERO;
      this._onDataChange(this, movie, newMovie);
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

    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._filmPopupComponent.resetSmile();

    removePopup(this._filmPopupComponent);
    this._mode = Mode.DEFAULT;
  }

  _switchCardToPopup() {
    this._onViewChange();

    render(this._bodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
  }

  _onEscKeyDown(evt) {
    const isEscDown = evt.key === KeyDown.ESCAPE || evt.key === KeyDown.ESC;

    if (isEscDown) {
      this._switchPopupToCard();
    }
  }
}
