import FilterView from '../view/filter-view';
import {render} from '../framework/render';
import {filter} from '../utils/filter';

export default class FilterPresenter {
  #container = null;
  #eventsModel = null;

  #events = [];
  #filters = [];

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.getEvents()];
    this.#filters = this.#generateFilters(this.#events);

    render(new FilterView(this.#filters), this.#container);
  }

  #generateFilters(events) {
    return Object.entries(filter)
      .map(([filterType, filterEvents]) => ({
        type: filterType,
        hasEvents: filterEvents(events).length > 0
      }));
  }
}
