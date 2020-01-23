import API from './api.js';
import StatisticsComponent from './components/statistics.js';
import SortMenuComponent from './components/sort-menu.js';
import LoadingComponent from './components/loading.js';
import FilterController from './controller/filter-controller.js';
import PageController from './controller/page-controller.js';
import {render, RenderPosition, remove} from './utils/render.js';
import MoviesModel from './models/movies.js';
import {FilterType, TagName, ZERO} from './const.js';

const AUTHORIZATION = `Basic djds7gffkdhs2d=_9fh=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();


const siteMainElement = document.querySelector(`.${TagName.MAIN}`);
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const sortMenuComponent = new SortMenuComponent();
render(siteMainElement, sortMenuComponent, RenderPosition.BEFOREEND);


const statisticsComponent = new StatisticsComponent(moviesModel);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

const loadingComponent = new LoadingComponent();
render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(siteMainElement, moviesModel, api, sortMenuComponent, loadingComponent);
statisticsComponent.hide();

// Переключение между экранами Статистики и Фильмов
filterController.setScreenChangeHandler((activeFilter) => {
  switch (activeFilter) {
    case FilterType.STATS:
      pageController.hide();
      statisticsComponent.show();

      if (moviesModel.getAllMovies().length === ZERO) {
        remove(loadingComponent);
      }
      break;
    default:
      statisticsComponent.hide();
      pageController.show();

      if (moviesModel.getAllMovies().length === ZERO) {
        render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);
      }
      break;
  }
});


api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    const commentsPromisses = movies.map((movie) => {

      return api.getComments(movie.filmInfo.id)
        .then((comments) => {
          movie.filmInfo.commentUsers = comments;
        });
    });

    Promise.all(commentsPromisses)
      .then(() => {

        filterController.render();
        pageController.render();
      });
  });

