import ProfileRatingComponent from './components/profile-rating.js';
import SiteMenuComponent from './components/site-menu.js';
import SortMenuComponent from './components/sort-menu.js';
import NoMoviesComponent from './components/no-movies.js';
import FilmsListComponent from './components/films-list.js';
import CardFilmComponent from './components/card-film.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import FilmDetailsPopupComponent from './components/film-details.js';
import {generateFilmCards} from './mock/card-film.js';
import {ZERO, ONE, Feature, KeyDown} from './const.js';
import {render, renderExtraFilmBlock, RenderPosition, remove, removePopup} from './utils/render.js';


const COUNT_MAIN_CARDS = 20;
const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;


const bodyElement = document.querySelector(`body`);


// Функция отрисовки карточек
const renderCard = (card, container) => {

  const cardFilmComponent = new CardFilmComponent(card);
  const filmDetailsPopupComponent = new FilmDetailsPopupComponent(card);

  let cardElements = [];
  cardElements.push(cardFilmComponent.getElement().querySelector(`.film-card__poster`));
  cardElements.push(cardFilmComponent.getElement().querySelector(`.film-card__title`));
  cardElements.push(cardFilmComponent.getElement().querySelector(`.film-card__comments`));

  const onEscKeyDown = (evt) => {

    const isEscDown = evt.key === KeyDown.ESCAPE || evt.key === KeyDown.ESC;

    if (isEscDown) {
      removePopup(filmDetailsPopupComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };


  cardElements.forEach((element) => {
    element.addEventListener(`click`, () => {
      render(bodyElement, filmDetailsPopupComponent, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
    });
  });

  const closeButtonElement = filmDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButtonElement.addEventListener(`click`, () => {
    filmDetailsPopupComponent.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, cardFilmComponent, RenderPosition.BEFOREEND);

};


// Функция отрисовки блока фильмов
const renderContainer = (container, cards) => {

  const isNoMovies = cards.length === ZERO;

  if (isNoMovies) {
    render(container, new NoMoviesComponent(), RenderPosition.BEFOREEND);
    return;
  }

  const filmsListComponent = new FilmsListComponent();
  render(container, filmsListComponent, RenderPosition.BEFOREEND);


  const filmsListElements = filmsListComponent.getElement().querySelectorAll(`.films-list__container`);
  let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

  cards.slice(ZERO, showingCardCount).forEach((card) => renderCard(card, filmsListElements[ZERO]));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(filmsListElements[ZERO], loadMoreButtonComponent, RenderPosition.AFTER);


  // Обработчик на кнопке показать еще
  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {

    const prevCardCount = showingCardCount;
    showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevCardCount, showingCardCount).forEach((card) => renderCard(card, filmsListElements[ZERO]));

    if (showingCardCount >= cards.length) {
      remove(loadMoreButtonComponent);
    }

  });


  const footerStatisticsElement = bodyElement.querySelector(`.footer__statistics p`);
  footerStatisticsElement.textContent = `${cards.length} movies inside`;


  // Отсортировка фильмов в блоки самые комментированные и рейтинговые
  const blockFilmElements = document.querySelectorAll(`.films-list__container`);
  const extraFilmElement = document.querySelectorAll(`.films-list--extra`);

  const topRatedElement = blockFilmElements[ONE];
  const extraTopRatedElement = extraFilmElement[ZERO];

  const mostCommentedElement = blockFilmElements[TWO];
  const extraMostCommentedElement = extraFilmElement[ONE];


  renderExtraFilmBlock(cards, Feature.rating, topRatedElement, extraTopRatedElement);
  renderExtraFilmBlock(cards, Feature.comment, mostCommentedElement, extraMostCommentedElement);

};

const mainCards = generateFilmCards(COUNT_MAIN_CARDS);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileRatingComponent(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortMenuComponent(), RenderPosition.BEFOREEND);

renderContainer(siteMainElement, mainCards);

export {mainCards, renderCard};
