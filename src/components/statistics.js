import AbstractSmartComponent from './smart-component.js';
import {getGeneralTimeMovies, getTimeFilm} from '../utils/common.js';
import {ZERO, SymbolName} from '../const.js';


// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

const createStatisticsTemplate = (quantity, time, genre, rank) => {

  let quantityMovies = null;
  let timeMovies = null;
  let topGenre = null;

  if (quantity > ZERO) {

    quantityMovies = quantity;
    timeMovies = getGeneralTimeMovies(getTimeFilm(time));
    topGenre = genre;

  } else {

    quantityMovies = ZERO;

    timeMovies = {
      hours: ZERO,
      minutes: ZERO
    };

    topGenre = SymbolName.LONG_DASH;

  }

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="51" height="51">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${quantityMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${timeMovies.hours} <span class="statistic__item-description">h</span>${timeMovies.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};


export default class Statistics extends AbstractSmartComponent {

  getTemplate() {
    return createStatisticsTemplate(27, 11343, `Comedy`, `Fan`);
  }
}
