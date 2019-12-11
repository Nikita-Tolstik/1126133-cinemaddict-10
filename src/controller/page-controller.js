import NoMoviesComponent from '../components/no-movies.js';
import FilmsListComponent from '../components/films-list.js';
import CardFilmComponent from '../components/card-film.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import FilmDetailsPopupComponent from '../components/film-details.js';
import SortMenuComponent, {SortType} from '../components/sort-menu.js';
import {ZERO, ONE, Feature, KeyDown} from '../const.js';
import {getRandomNumber} from '../utils/common.js';
import {render, RenderPosition, remove, removePopup} from '../utils/render.js';


const SHOWING_CARDS_COUNT_ON_START = 5;
const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
const TWO = 2;

const bodyElement = document.querySelector(`body`);


// Функция создания карточки
const renderCard = (card, container) => {

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


  render(container, cardFilmComponent, RenderPosition.BEFOREEND);

};


// Отсортировка фильмов в блоки самые комментированные и рейтинговые
const renderExtraFilmBlock = (cards, feature, blockElement, extraElement) => {

  if (cards.length > ONE) {

    const sortCards = cards.slice().sort((a, b) => b.filmInfo[feature] - a.filmInfo[feature]);
    const isSame = sortCards.every((card) => sortCards[ZERO].filmInfo[feature] === card.filmInfo[feature]);

    if (isSame && sortCards[ZERO].filmInfo[feature] === ZERO) {
      extraElement.remove();
    } else if (isSame) {
      new Array(TWO).fill(``).forEach(() => renderCard(cards[getRandomNumber(ZERO, cards.length - ONE)], blockElement));
    } else {
      sortCards.slice(ZERO, TWO).forEach((card) => renderCard(card, blockElement));
    }

  } else {
    extraElement.remove();
  }
};

// Отрисовка карточек
const renderCards = (container, cards) => {
  cards.forEach((card) => renderCard(card, container));
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._noMoviesComponent = new NoMoviesComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._sortMenuComponent = new SortMenuComponent();
  }

  render(cards) {


    const renderLoadMoreButton = () => {

      if (showingCardCount >= cards.length) {
        return;
      }

      // Обработчик на кнопке показать еще
      this._loadMoreButtonComponent.setOnClickLoadMoreButton(() => {

        const prevCardCount = showingCardCount;
        showingCardCount = showingCardCount + SHOWING_CARDS_COUNT_BY_BUTTON;

        cards.slice(prevCardCount, showingCardCount).forEach((card) => renderCard(card, filmsListElements[ZERO]));

        if (showingCardCount >= cards.length) {
          remove(this._loadMoreButtonComponent);
        }

      });

      render(filmsListElements[ZERO], this._loadMoreButtonComponent, RenderPosition.AFTER);
    };

    const isNoMovies = cards.length === ZERO;

    if (isNoMovies) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);

    const filmsListElements = this._filmsListComponent.getElement().querySelectorAll(`.films-list__container`);
    let showingCardCount = SHOWING_CARDS_COUNT_ON_START;

    renderCards(filmsListElements[ZERO], cards.slice(ZERO, showingCardCount));
    renderLoadMoreButton();

    // Обработчик события на сортировку
    this._sortMenuComponent.onSetSortTypeChange((sortType) => {

      let sortedFilms = [];

      switch (sortType) {
        case SortType.DATE:
          sortedFilms = cards.slice().sort((a, b) => b.filmInfo.date - a.filmInfo.date);
          break;
        case SortType.RATING:
          sortedFilms = cards.slice().sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);
          break;
        case SortType.DEFAULT:
          sortedFilms = cards.slice(ZERO, SHOWING_CARDS_COUNT_ON_START);
          break;
      }

      filmsListElements[ZERO].innerHTML = ``;

      renderCards(filmsListElements[ZERO], sortedFilms);

      if (sortType === SortType.DEFAULT) {
        showingCardCount = SHOWING_CARDS_COUNT_ON_START;
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreButtonComponent);
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
  }
}
