import API from './api.js';
import StatisticsComponent from './components/statistics.js';
import FilterController from './controller/filter-controller.js';
import PageController from './controller/page-controller.js';
import {render, RenderPosition} from './utils/render.js';
import MoviesModel from './models/movies.js';
import {FilterType, TagName} from './const.js';

const AUTHORIZATION = `Basic djds7395jsdls34ks3gsuf4fhf4s2d=_9fh=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();


const siteMainElement = document.querySelector(`.${TagName.MAIN}`);
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();


const statisticsComponent = new StatisticsComponent(moviesModel, moviesModel.getAllMovies());
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);


const pageController = new PageController(siteMainElement, moviesModel, api);
statisticsComponent.hide();

// Переключение между экранами Статистики и Фильмов
filterController.setScreenChangeHandler((activeFilter) => {
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

