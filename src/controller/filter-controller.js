import FilterComponent from '../components/filter.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {FilterType} from '../const.js';

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
      this._activeFilter = oldComponent.getElement().querySelector(`.main-navigation__item--active`).dataset.filterType;
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
    this._moviesModel.setFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }
}
