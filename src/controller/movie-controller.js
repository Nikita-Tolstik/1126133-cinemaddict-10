import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import {KeyDown} from '../const.js';
import {render, RenderPosition, removePopup, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};


export default class MovieController {
  constructor(container, onDataChange, onViewChange) {

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._cardFilmComponent = null;
    this._filmPopupComponent = null;
    this._bodyElement = document.querySelector(`body`);
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
        this._switchPopupToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };


    // Метод карточки - обработчик события кликов на элементы карточки
    this._cardFilmComponent.setOnClickCardElements(() => {
      this._switchCardToPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    });


    // Связывает изменения в попапе с карточкой фильма
    this._filmPopupComponent.getElement()
      .addEventListener(`input`, (evt) => {

        let changedCard = null;

        switch (evt.target.id) {
          case `watchlist`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: !card.userDetails.isWatchlist,
                isWatched: card.userDetails.isWatched,
                isFavorite: card.userDetails.isFavorite,
              }
            });
            break;
          case `watched`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: card.userDetails.isWatchlist,
                isWatched: !card.userDetails.isWatched,
                isFavorite: card.userDetails.isFavorite,
              }
            });
            break;
          case `favorite`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: card.userDetails.isWatchlist,
                isWatched: card.userDetails.isWatched,
                isFavorite: !card.userDetails.isFavorite,
              }
            });
            break;
        }

        if (changedCard) {
          this._onDataChange(this, card, changedCard);
        }
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

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchPopupToCard();
    }
  }

  _switchPopupToCard() {
    removePopup(this._filmPopupComponent);
    this._mode = Mode.DEFAULT;
  }

  _switchCardToPopup() {
    this._onViewChange();

    render(this._bodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
  }

}


// Заменил на обычный обработчик в _subcribeOnEvents
// Метод попапа - обработчик события клика на кнопку зыкрыть
// this._filmPopupComponent.setOnClickCloseButtonPopup(() => {
//   this._filmPopupComponent.getElement().remove();
//   document.removeEventListener(`keydown`, onEscKeyDown);
// });

// Заменил на обычный обработчик в _subcribeOnEvents
// // Метод попапа - обработчик события клика на Watchlist
// this._filmPopupComponent.setOnWatchlistInputClick(() => {
//   this._onDataChange(this, card, Object.assign({}, card, {
//     userDetails: {
//       isWatchlist: !card.userDetails.isWatchlist,
//       isWatched: card.userDetails.isWatched,
//       isFavorite: card.userDetails.isFavorite,
//     }
//   }));
// });

// Заменил на обычный обработчик в _subcribeOnEvents
// // Метод попапа - обработчик события клика на Watched
// this._filmPopupComponent.setOnWatchedInputClick(() => {
//   this._onDataChange(this, card, Object.assign({}, card, {
//     userDetails: {
//       isWatchlist: card.userDetails.isWatchlist,
//       isWatched: !card.userDetails.isWatched,
//       isFavorite: card.userDetails.isFavorite,
//     }
//   }));
// });

// Заменил на обычный обработчик в _subcribeOnEvents
// // Метод попапа - обработчик события клика на Favorite
// this._filmPopupComponent.setOnFavoriteInputClick(() => {
//   this._onDataChange(this, card, Object.assign({}, card, {
//     userDetails: {
//       isWatchlist: card.userDetails.isWatchlist,
//       isWatched: card.userDetails.isWatched,
//       isFavorite: !card.userDetails.isFavorite,
//     }
//   }));
// });
