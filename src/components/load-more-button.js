import {createElement} from '../util.js';

const createLoadMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class SiteMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
