import API from './api.js';
import StatisticsComponent from './components/statistics.js';
import FilterController from './controller/filter-controller.js';
import PageController from './controller/page-controller.js';
import {render, RenderPosition} from './utils/render.js';
import MoviesModel from './models/movies.js';
import {FilterType, TagName} from './const.js';

const AUTHORIZATION = `Basic djds7395jsdls34ks3suf4f4s2d`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();


const siteMainElement = document.querySelector(`.${TagName.MAIN}`);
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();


const statisticsComponent = new StatisticsComponent(moviesModel, moviesModel.getAllMovies());
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);


const pageController = new PageController(siteMainElement, moviesModel);
statisticsComponent.hide();

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

api.getMovies()
  .then((movies) => {
    console.log(1);

    const hhh = movies.map((movie) => {

      api.getComments(movie.filmInfo.id)
        .then((response) => {
          console.log(2);
          movie.filmInfo.commentUsers = response;
          return movie;
        });
      return movie;
    });
    return hhh;
  })
  .then((movies) => {
    console.log(movies);
    moviesModel.setMovies(movies);
    filterController.render();
    pageController.render();
  });


