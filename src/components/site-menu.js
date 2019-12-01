import {mainCards} from '../main.js';


export const createSiteMenuTemplate = () => {


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
</nav>

<ul class="sort">
<li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#" class="sort__button">Sort by date</a></li>
<li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>


<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
</section>`
  );
};
