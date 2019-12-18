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

  render(card) {

    const oldCardFilmComponent = this._cardFilmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._cardFilmComponent = new CardFilmComponent(card);
    this._filmPopupComponent = new FilmDetailsPopupComponent(card);


    // Метод карточки - обработчик события кликов на элементы карточки
    this._cardFilmComponent.setOnClickCardElements(() => {
      this._switchCardToPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    // Связывает изменения в попапе с карточкой фильма
    this._filmPopupComponent.getElement()
      .addEventListener(`input`, (evt) => {

        let changedCard = null;
        let cloneDeepCard = null;

        switch (evt.target.name) {
          case `watchlist`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: !card.userDetails.isWatchlist,
                isWatched: card.userDetails.isWatched,
                isFavorite: card.userDetails.isFavorite,
              }
            });
            cloneDeepCard = clonedeep(changedCard);
            break;
          case `watched`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: card.userDetails.isWatchlist,
                isWatched: !card.userDetails.isWatched,
                isFavorite: card.userDetails.isFavorite,
              }
            });
            cloneDeepCard = clonedeep(changedCard);
            break;
          case `favorite`:
            changedCard = Object.assign({}, card, {
              userDetails: {
                isWatchlist: card.userDetails.isWatchlist,
                isWatched: card.userDetails.isWatched,
                isFavorite: !card.userDetails.isFavorite,
              }
            });
            cloneDeepCard = clonedeep(changedCard);
            break;
        }

        if (cloneDeepCard) {
          this._onDataChange(this, card, cloneDeepCard);
        }
      });

    // Метод карточки - обработчик события клика на Watchlist
    this._cardFilmComponent.setOnWatchlistButtonClick(() => {
      this._onDataChange(this, card, clonedeep(
          Object.assign({}, card, {
            userDetails: {
              isWatchlist: !card.userDetails.isWatchlist,
              isWatched: card.userDetails.isWatched,
              isFavorite: card.userDetails.isFavorite,
            }
          }))
      );
    });


    // Метод карточки - обработчик события клика Watched
    this._cardFilmComponent.setOnWatchedButtonClick(() => {
      this._onDataChange(this, card, clonedeep(
          Object.assign({}, card, {
            userDetails: {
              isWatchlist: card.userDetails.isWatchlist,
              isWatched: !card.userDetails.isWatched,
              isFavorite: card.userDetails.isFavorite,
            }
          }))
      );
    });

    // Метод карточки - обработчик события клика Favorite
    this._cardFilmComponent.setOnFavoriteButtonClick(() => {
      this._onDataChange(this, card, clonedeep(
          Object.assign({}, card, {
            userDetails: {
              isWatchlist: card.userDetails.isWatchlist,
              isWatched: card.userDetails.isWatched,
              isFavorite: !card.userDetails.isFavorite,
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
    removePopup(this._filmPopupComponent);
    this._mode = Mode.DEFAULT;

    // Сброс неотправленных комментариев, эмодзи при закрытии попапа
    // this._filmPopupComponent.resetEmoji();
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
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }

  }
}

