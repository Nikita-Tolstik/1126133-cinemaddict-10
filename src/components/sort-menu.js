import AbstractComponent from './abstract-component.js';
import {TAG_A} from '../const.js';


export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const toggleClassSortType = (blockElement, element) => {
  blockElement.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);

  element.classList.add(`sort__button--active`);
};

const createSortMenuTemplate = () => {

  return (
    `<ul class="sort">
     <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
     <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
     <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
   </ul>`
  );
};


export default class SortMenu extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  setOnSortTypeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      evt.preventDefault();

      if (evt.target.tagName !== TAG_A) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      toggleClassSortType(this.getElement(), evt.target);

      this._currentSortType = sortType;

      handler(this._currentSortType);

    });
  }

  resetSortType(blockElement, element) {
    toggleClassSortType(blockElement, element);
    this._currentSortType = SortType.DEFAULT;
  }
}
