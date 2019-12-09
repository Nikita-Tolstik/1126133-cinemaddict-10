import {renderCard} from '../main.js';
import {ZERO, ONE} from '../const.js';
import {getRandomNumber} from './common.js';

const TWO = 2;

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`
};

// Отрисовка компонентов на страницу
export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER:
      container.after(component.getElement());
      break;
  }
};

// Создание елемента из разметки
export const createElement = (template) => {

  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Отсортировка фильмов в блоки самые комментированные и рейтинговые
export const renderExtraFilmBlock = (cards, feature, blockElement, extraElement) => {

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

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const removePopup = (component) => {
  const parentElement = component.getElement().parentElement;
  const popupElement = component.getElement();

  if (parentElement && popupElement) {
    parentElement.removeChild(popupElement);
  }

};
