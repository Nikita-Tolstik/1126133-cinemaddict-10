import FilterComponent from '../components/filter.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {FilterType, TagName, ZERO} from '../const.js';

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setOnDataChange(this._onDataChange);

    this._activeFilter = FilterType.ALL;
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getAllMovies();

    const oldComponent = this._filterComponent;

    if (oldComponent) {
      this._activeFilter = oldComponent.getElement().querySelector(`.${ACTIVE_FILTER_CLASS}`).dataset.filterType;
    }

    this._filterComponent = new FilterComponent(allMovies, this._activeFilter);
    this._filterComponent.setOnFilterChange(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {

    if (this._moviesModel.getAllMovies().length === ZERO) {
      return;
    }

    this._moviesModel.setFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }

  // Переключение между экранами Статистики и Фильмов
  setOnScreenChange(handler) {
    this._filterComponent.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== TagName.A) {
        return;
      }

      const filterName = evt.target.dataset.filterType;

      if (this._activeFilter === filterName) {
        return;
      }

      this._activeFilter = filterName;

      this._filterComponent.getElement().querySelector(`.${ACTIVE_FILTER_CLASS}`).classList.remove(ACTIVE_FILTER_CLASS);
      evt.target.classList.add(ACTIVE_FILTER_CLASS);

      handler(this._activeFilter);
    });
  }
}
