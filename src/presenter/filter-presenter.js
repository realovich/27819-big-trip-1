import FilterView from '../view/filter-view';
import {remove, render, replace} from '../framework/render';
import {filter} from '../utils/filter';
import {UpdateType} from '../utils/const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;

  #filterComponent = null;

  constructor({filterContainer, filterModel, eventsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const events = this.#eventsModel.getEvents();

    return Object.entries(filter)
      .map(([filterType, filterEvents]) => ({
        type: filterType,
        hasEvents: filterEvents(events).length > 0
      }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
