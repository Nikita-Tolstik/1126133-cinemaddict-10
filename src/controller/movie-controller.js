import CardFilmComponent from '../components/card-film.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import {KeyDown} from '../const.js';
import {render, RenderPosition, removePopup} from '../utils/render.js';

const bodyElement = document.querySelector(`body`);

export default class MovieController {
  constructor(container) {

    this._container = container;
  }

  render(card) {


    // Функция создания карточки
    const cardFilmComponent = new CardFilmComponent(card);
    const filmDetailsPopupComponent = new FilmDetailsPopupComponent(card);


    const onEscKeyDown = (evt) => {

      const isEscDown = evt.key === KeyDown.ESCAPE || evt.key === KeyDown.ESC;

      if (isEscDown) {
        removePopup(filmDetailsPopupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };


    // Метод карточки - обработчик события кликов на элементы карточки
    cardFilmComponent.setOnClickCardElements(() => {
      render(bodyElement, filmDetailsPopupComponent, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Метод попапа - обработчик события клика на кнопку зыкрыть
    filmDetailsPopupComponent.setOnClickCloseButtonPopup(() => {
      filmDetailsPopupComponent.getElement().remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });


    render(this._container, cardFilmComponent, RenderPosition.BEFOREEND);

  }


}

