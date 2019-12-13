import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import {KeyDown} from '../const.js';
import {render, RenderPosition, removePopup, replace} from '../utils/render.js';

const bodyElement = document.querySelector(`body`);

export default class MovieController {
  constructor(container, onDataChange) {

    this._container = container;
    this._onDataChange = onDataChange;

    this._cardFilmComponent = null;
    this._filmPopupComponent = null;
  }

  render(card) {

    const oldCardFilmComponent = this._cardFilmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;


    // Функция создания карточки
    this._cardFilmComponent = new CardFilmComponent(card);
    this._filmPopupComponent = new FilmDetailsPopupComponent(card);


    const onEscKeyDown = (evt) => {

      const isEscDown = evt.key === KeyDown.ESCAPE || evt.key === KeyDown.ESC;

      if (isEscDown) {
        removePopup(this._filmPopupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };


    // Метод карточки - обработчик события кликов на элементы карточки
    this._cardFilmComponent.setOnClickCardElements(() => {
      render(bodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Метод попапа - обработчик события клика на кнопку зыкрыть
    this._filmPopupComponent.setOnClickCloseButtonPopup(() => {
      this._filmPopupComponent.getElement().remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });


    // Метод попапа - обработчик события клика на Watchlist
    this._filmPopupComponent.setOnWatchlistInputClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: !card.userDetails.isWatchlist,
          isWatched: card.userDetails.isWatched,
          isFavorite: card.userDetails.isFavorite,
        }
      }));
    });

    // Метод попапа - обработчик события клика на Watched
    this._filmPopupComponent.setOnWatchedInputClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: card.userDetails.isWatchlist,
          isWatched: !card.userDetails.isWatched,
          isFavorite: card.userDetails.isFavorite,
        }
      }));
    });

    // Метод попапа - обработчик события клика на Favorite
    this._filmPopupComponent.setOnFavoriteInputClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: card.userDetails.isWatchlist,
          isWatched: card.userDetails.isWatched,
          isFavorite: !card.userDetails.isFavorite,
        }
      }));
    });


    // Метод карточки - обработчик события клика на Watchlist
    this._cardFilmComponent.setOnWatchlistButtonClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: !card.userDetails.isWatchlist,
          isWatched: card.userDetails.isWatched,
          isFavorite: card.userDetails.isFavorite,
        }
      }));
    });

    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setOnWatchedButtonClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: card.userDetails.isWatchlist,
          isWatched: !card.userDetails.isWatched,
          isFavorite: card.userDetails.isFavorite,
        }
      }));
    });

    // Метод карточки - обработчик события клика Favorite
    this._cardFilmComponent.setOnFavoriteButtonClick(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        userDetails: {
          isWatchlist: card.userDetails.isWatchlist,
          isWatched: card.userDetails.isWatched,
          isFavorite: !card.userDetails.isFavorite,
        }
      }));
    });


    if (oldCardFilmComponent && oldFilmPopupComponent) {

      replace(this._cardFilmComponent, oldCardFilmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._cardFilmComponent, RenderPosition.BEFOREEND);
    }
  }


}

