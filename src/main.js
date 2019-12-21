import ProfileRatingComponent from './components/profile-rating.js';
import SiteMenuComponent from './components/site-menu.js';
import PageController from './controller/page-controller.js';
import {generateFilmCards} from './mock/card-film.js';
import {render, RenderPosition} from './utils/render.js';
import MoviesModel from './models/movies.js';

const COUNT_MAIN_CARDS = 20;

export const cards = generateFilmCards(COUNT_MAIN_CARDS);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileRatingComponent(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);


const moviesModel = new MoviesModel();
moviesModel.setMovies(cards);

const pageController = new PageController(siteMainElement, moviesModel);

pageController.render();


