import FilterComponent from '../components/filter.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {FilterType, TagName, ZERO} from '../const.js';

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._filterComponent = null;
    this._handler = null;
    this._activeFilter = FilterType.ALL;


    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getAllMovies();

    const oldComponent = this._filterComponent;

    if (oldComponent) {
      this._activeFilter = oldComponent.getElement().querySelector(`.${ACTIVE_FILTER_CLASS}`).dataset.filterType;
    }

    this._filterComponent = new FilterComponent(allMovies, this._activeFilter);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }

    // Восстановление обработчика переключения между экранами карточек и статистики
    if (this._handler) {
      this.setScreenChangeHandler(this._handler);
    }
  }

  _filterChangeHandler(filterType) {

    if (this._moviesModel.getAllMovies().length === ZERO) {
      return;
    }

    this._moviesModel.setFilter(filterType);
  }

  _dataChangeHandler() {
    this.render();
  }

  // Переключение между экранами Статистики и Фильмов
  setScreenChangeHandler(handler) {
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

    this._handler = handler;
  }
}
