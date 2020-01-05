import AbstractSmartComponent from './smart-component.js';
import {getGeneralTimeMovies, getTimeFilm, valuesComparator, getRating, getDifferenceDate} from '../utils/common.js';
import {getWatchedMovies} from '../utils/filter.js';
import {ZERO, ONE, SymbolName} from '../const.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const TYPE_CHART = `horizontalBar`;
const BACKGROUND_COLOR = `yellow`;
const DATALABELS_COLOR = `white`;
const DATALABELS_ANCHOR = `start`;
const DATALABELS_ALIGN = `left`;
const DATALABELS_OFFSET = 50;
const DATALABELS_FONT_SIZE = 30;
const SCALES_MIN = 0;
const TICKS_COLOR = `yellow`;
const TICKS_FONT_SIZE = 30;
const TICKS_PADDING = 100;
const MAX_WEEK = 7;
const MAX_MONTH = 31;
const MAX_YEAR = 365;

const TypeStats = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getMoviesByFilterStats = (watchedMovies, dayMin, dayMax) => {

  return watchedMovies.filter((movie) => {

    const numberDate = getDifferenceDate(movie.userDetails.watchedDate);
    let isCorrectly = false;

    if (numberDate > dayMin && numberDate <= dayMax) {
      isCorrectly = true;
    }
    return isCorrectly;
  });

};

const renderGenresChart = (statisticCtx, movies) => {

  const sortedGenres = getSortedGenres(movies);

  const genres = getGenresForChart(sortedGenres);
  const quantity = getQuantityForChart(sortedGenres);


  return new Chart(statisticCtx, {

    type: TYPE_CHART,
    data: {
      labels: genres,
      datasets: [{
        data: quantity,
        backgroundColor: BACKGROUND_COLOR
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    showTooltips: false,
    plugins: [ChartDataLabels],

    options: {
      plugins: {
        datalabels: {
          color: DATALABELS_COLOR,
          anchor: DATALABELS_ANCHOR,
          align: DATALABELS_ALIGN,
          offset: DATALABELS_OFFSET,
          font: {
            size: DATALABELS_FONT_SIZE
          }
        },
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: SCALES_MIN,
            suggestedMax: quantity[ZERO],
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,

          },
          ticks: {
            fontColor: TICKS_COLOR,
            fontSize: TICKS_FONT_SIZE,
            padding: TICKS_PADDING,
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      },
    }
  });
};

// Данные для чарт: кол-во фильмов
const getQuantityForChart = (movies) => {
  let values = [];

  movies.forEach((it) => {
    values.push(it.quantity);
  });

  return values;
};

// Данные для чарт: кол-во жанров
const getGenresForChart = (movies) => {
  let values = [];

  movies.forEach((it) => {
    values.push(it.genre);
  });

  return values;
};

const getSortedGenres = (movies) => {

  const watchedMovies = getWatchedMovies(movies.slice());

  let allGenres = [];

  watchedMovies.forEach((movie) => {
    return allGenres.push(...movie.filmInfo.genres);
  });

  const arrayGenres = Array.from(new Set(allGenres));

  let quantityGenres = [];

  arrayGenres.forEach((mainGenre) => {
    let index = ZERO;

    allGenres.forEach((genreSame) => {
      if (mainGenre === genreSame) {
        index += ONE;
      }
    });

    return quantityGenres.push({
      genre: mainGenre,
      quantity: index,
    });
  });


  const sortGenres = quantityGenres.sort((a, b) => {
    let difference = b.quantity - a.quantity;

    if (difference === ZERO) {
      difference = valuesComparator(a.genre, b.genre);
    }
    return difference;
  });

  return sortGenres;
};

const createStatisticsTemplate = (allMovies, sortedMovies, activeFilter) => {

  const movies = getWatchedMovies(sortedMovies.slice());

  const quantity = movies.length;
  const time = movies.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.filmInfo.time;
  }, ZERO);


  let quantityMovies;
  let timeMovies;
  let topGenre;
  const rank = getRating(getWatchedMovies(allMovies).length);

  if (quantity > ZERO) {

    const sortedGenres = getSortedGenres(movies);
    const genre = sortedGenres[ZERO].genre;

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

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${activeFilter === TypeStats.ALL_TIME ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${activeFilter === TypeStats.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${activeFilter === TypeStats.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${activeFilter === TypeStats.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${activeFilter === TypeStats.YEAR ? `checked` : ``}>
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

  constructor(moviesModel, movies) {
    super();

    this._moviesModel = moviesModel;
    this._movies = movies;

    this._genresChart = null;

    this._activeFilter = TypeStats.ALL_TIME;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesModel.getAllMovies(), this._movies, this._activeFilter);
  }

  show() {
    super.show();
    this._activeFilter = TypeStats.ALL_TIME;
    this.rerender(this._moviesModel.getAllMovies());
  }

  _renderChart() {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._genresChart = renderGenresChart(statisticCtx, this._movies);
  }

  _resetChart() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  rerender(movies) {
    this._movies = movies;

    super.rerender();

    this._renderChart();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement().querySelector(`form`);

    element.addEventListener(`change`, (evt) => {
      evt.preventDefault();

      const watchedMovies = getWatchedMovies(this._moviesModel.getAllMovies());


      switch (evt.target.value) {
        case TypeStats.ALL_TIME:
          this._movies = this._moviesModel.getAllMovies();
          break;
        case TypeStats.TODAY:
          this._movies = getMoviesByFilterStats(watchedMovies, ZERO, ONE);
          break;
        case TypeStats.WEEK:
          this._movies = getMoviesByFilterStats(watchedMovies, ZERO, MAX_WEEK);
          break;
        case TypeStats.MONTH:
          this._movies = getMoviesByFilterStats(watchedMovies, ZERO, MAX_MONTH);
          break;
        case TypeStats.YEAR:
          this._movies = getMoviesByFilterStats(watchedMovies, ZERO, MAX_YEAR);
          break;
      }


      this._activeFilter = evt.target.value;
      this.rerender(this._movies);
    });
  }
}


