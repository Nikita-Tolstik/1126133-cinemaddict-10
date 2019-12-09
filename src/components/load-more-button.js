import AbstractComponent from './abstract-component.js';

const createLoadMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class SiteMenu extends AbstractComponent {

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }
}
