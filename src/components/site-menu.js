import {mainCards} from '../main.js';
import {createElement} from '../util.js';


const createSiteMenuTemplate = () => {


  const wathclistFilters = mainCards.filter((card) => card.userDetails.isWathclist === true);
  const historyFilters = mainCards.filter((card) => card.userDetails.isHistory === true);
  const favoritesFilters = mainCards.filter((card) => card.userDetails.isFavorites === true);


  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${wathclistFilters.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyFilters.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesFilters.length}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate();
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
