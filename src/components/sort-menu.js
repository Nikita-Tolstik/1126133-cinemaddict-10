import AbstractComponent from './abstract-component.js';
import {TagName} from '../const.js';


export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const ACTIVE_BUTTON_CLASS = `sort__button--active`;

const toggleClassSortType = (blockElement, element) => {
  blockElement.querySelector(`.${ACTIVE_BUTTON_CLASS}`).classList.remove(ACTIVE_BUTTON_CLASS);

  element.classList.add(ACTIVE_BUTTON_CLASS);
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

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      evt.preventDefault();

      if (evt.target.tagName !== TagName.A) {
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
