import {cards} from '../main.js';
import AbstractComponent from './abstract-component.js';


const createSiteMenuTemplate = () => {


  const watchlistFilters = cards.filter((card) => card.userDetails.isWatchlist === true);
  const watchedFilters = cards.filter((card) => card.userDetails.isWatched === true);
  const favoriteFilters = cards.filter((card) => card.userDetails.isFavorite === true);


  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>

      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistFilters.length}</span></a>

      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watchedFilters.length}</span></a>

      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteFilters.length}</span></a>

      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  getTemplate() {
    return createSiteMenuTemplate();
  }
}
