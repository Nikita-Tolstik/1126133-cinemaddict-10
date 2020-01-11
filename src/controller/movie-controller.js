import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import {KeyDown, TagName} from '../const.js';
import {render, RenderPosition, removePopup, replace} from '../utils/render.js';
import clonedeep from 'lodash.clonedeep';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
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
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: !movie.userDetails.isWatchlist,
              isWatched: movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
              watchedDate: movie.userDetails.watchedDate
            }
          }))
      );
    });

    // Метод попапа - обработчик события клика на Watched
    this._filmPopupComponent.setOnWatchedInputClick(() => {

      const isWatchedMovie = movie.userDetails.isWatched;

      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: !movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
              watchedDate: isWatchedMovie ? null : new Date().toISOString()
            }
          }))
      );
    });

    // Метод попапа - обработчик события клика на Favorite
    this._filmPopupComponent.setOnFavoriteInputClick(() => {
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: movie.userDetails.isWatched,
              isFavorite: !movie.userDetails.isFavorite,
              watchedDate: movie.userDetails.watchedDate
            }
          }))
      );
    });


    // Метод карточки - обработчик события клика на Watchlist
    this._cardFilmComponent.setOnWatchlistButtonClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: !movie.userDetails.isWatchlist,
              isWatched: movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
              watchedDate: movie.userDetails.watchedDate
            }
          }))
      );
    });

    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setOnWatchedButtonClick((evt) => {
      evt.preventDefault();

      const isWatchedMovie = movie.userDetails.isWatched;

      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: !movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
              watchedDate: isWatchedMovie ? null : new Date().toISOString()
            }
          }))
      );
    });

    // Метод карточки - обработчик события клика Favorite
    this._cardFilmComponent.setOnFavoriteButtonClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: movie.userDetails.isWatched,
              isFavorite: !movie.userDetails.isFavorite,
              watchedDate: movie.userDetails.watchedDate
            }
          }))
      );
    });

    // Удаление комментария
    this._filmPopupComponent.setOnClickDeleteCommentButton(() => {
      this._onDataChange(this, movie, null);
    });


    // Добавление нового комментрария
    this._filmPopupComponent.setOnFormSubmit(() => {
      const newComment = this._filmPopupComponent.getFormData();
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
