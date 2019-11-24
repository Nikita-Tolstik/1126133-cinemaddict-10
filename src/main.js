import {createProfileRatingTemplate} from './components/profile-rating.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createCardFilmTemplate} from './components/card-film.js';
import {createLoadMoreButtonTemplate} from './components/load-more-button.js';
import {createFilmDetailsPopupTemplate} from './components/film-details.js';

let render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

let siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileRatingTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const filmsListElements = siteFilmsElement.querySelectorAll(`.films-list__container`);

const renderFilmCard = (container, template, place, quantity) => {

  new Array(quantity)
  .fill(``)
  .forEach(
      () => render(container, template, place)
  );

};

const CARD_LIST = 5;
const CARD_EXTRA = 2;

renderFilmCard(filmsListElements[0], createCardFilmTemplate(), `beforeend`, CARD_LIST);
render(filmsListElements[0], createLoadMoreButtonTemplate(), `afterend`);

renderFilmCard(filmsListElements[1], createCardFilmTemplate(), `beforeend`, CARD_EXTRA);
renderFilmCard(filmsListElements[2], createCardFilmTemplate(), `beforeend`, CARD_EXTRA);

const bodyElement = document.querySelector(`body`);
render(bodyElement, createFilmDetailsPopupTemplate(), `beforeend`);
