import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import {KeyDown} from '../const.js';
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

    this._bodyElement = document.querySelector(`body`);
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
      this._onDataChange(this, movie, clonedeep(movie));
    });


    // Метод попапа - обработчик события клика на Watchlist
    this._filmPopupComponent.setOnWatchlistInputClick(() => {
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: !movie.userDetails.isWatchlist,
              isWatched: movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
            }
          }))
      );
    });

    // Метод попапа - обработчик события клика на Watched
    this._filmPopupComponent.setOnWatchedInputClick(() => {
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: !movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
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
            }
          }))
      );
    });


    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setOnWatchedButtonClick((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, clonedeep(
          Object.assign({}, movie, {
            userDetails: {
              isWatchlist: movie.userDetails.isWatchlist,
              isWatched: !movie.userDetails.isWatched,
              isFavorite: movie.userDetails.isFavorite,
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
            }
          }))
      );
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
