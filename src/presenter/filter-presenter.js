import FilterView from '../view/filter-view';
import {render} from '../framework/render';
import {filter} from '../utils/filter';

export default class FilterPresenter {
  #filterContainer = null;
  #eventsModel = null;

  #events = [];
  #filters = [];

  constructor({container, eventsModel}) {
    this.#filterContainer = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#filters = this.#generateFilters(this.#events);

    render(new FilterView(this.#filters), this.#filterContainer);
  }

  #generateFilters(events) {
    return Object.entries(filter)
      .map(([filterType, filterEvents]) => ({
        type: filterType,
        hasEvents: filterEvents(events).length > 0
      }));
  }
}
