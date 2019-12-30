import ProfileRatingComponent from './components/profile-rating.js';
import StatisticsComponent from './components/statistics.js';
import FilterController from './controller/filter-controller.js';
import PageController from './controller/page-controller.js';
import {generateFilmCards} from './mock/card-film.js';
import {render, RenderPosition} from './utils/render.js';
import MoviesModel from './models/movies.js';
import {FilterType, TagName} from './const.js';

const COUNT_MAIN_CARDS = 20;
const cards = generateFilmCards(COUNT_MAIN_CARDS);


const siteHeaderElement = document.querySelector(`.${TagName.HEADER}`);
render(siteHeaderElement, new ProfileRatingComponent(), RenderPosition.BEFOREEND);


const moviesModel = new MoviesModel();
moviesModel.setMovies(cards);


const siteMainElement = document.querySelector(`.${TagName.MAIN}`);
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();


const statisticsComponent = new StatisticsComponent();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);


const pageController = new PageController(siteMainElement, moviesModel);
statisticsComponent.hide();
pageController.render();

// Переключение между экранами Статистики и Фильмов
filterController.setOnScreenChange((activeFilter) => {

  switch (activeFilter) {
    case FilterType.STATS:
      pageController.hide();
      statisticsComponent.show();
      break;
    default:
      statisticsComponent.hide();
      pageController.show();
      break;
  }
});

