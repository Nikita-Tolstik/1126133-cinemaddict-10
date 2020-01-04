import StatisticsComponent from './components/statistics.js';
import FilterController from './controller/filter-controller.js';
import PageController from './controller/page-controller.js';
import {generateFilmCards} from './mock/card-film.js';
import {render, RenderPosition} from './utils/render.js';
import MoviesModel from './models/movies.js';
import {FilterType, TagName} from './const.js';

// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

const COUNT_MAIN_CARDS = 20;
const cards = generateFilmCards(COUNT_MAIN_CARDS);


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


// const element = document.querySelector(`.statistic__chart`);


// const renderColorsChart = (colorsCtx) => {


//   return new Chart(colorsCtx, {

//     type: `horizontalBar`,
//     data: {
//       labels: [`Action`, `Drama`, `Comedy`, `Thriller`, `TVSeries`],
//       datasets: [{
//         data: [15, 2, 7, 5, 9],
//         backgroundColor: `yellow`
//       }]
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     showTooltips: false,
//     plugins: [ChartDataLabels],

//     options: {
//       plugins: {
//         datalabels: {
//           color: `white`,
//           anchor: `start`,
//           align: `left`,
//           offset: 50,
//           font: {
//             size: 30
//           }
//         },
//       },
//       scales: {
//         xAxes: [{
//           display: false,
//           ticks: {
//             suggestedMin: 0,
//             suggestedMax: 15,
//           }
//         }],
//         yAxes: [{
//           gridLines: {
//             display: false,
//             drawBorder: false,

//           },
//           ticks: {
//             fontColor: `yellow`,
//             fontSize: 30,
//             padding: 100,
//           }
//         }]
//       },
//       tooltips: {
//         enabled: false
//       },
//       legend: {
//         display: false
//       },
//     }
//   });
// };
// renderColorsChart(element);


