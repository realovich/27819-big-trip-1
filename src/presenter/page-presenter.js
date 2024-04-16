import NoEventsView from '../view/no-events-view';
import EventsListView from '../view/events-list-view';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import EventPresenter from './event-presenter';
import {render} from '../framework/render';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/sort';

const filtersElement = document.querySelector('.trip-controls__filters');

export default class PagePresenter {
  #eventsListComponent = new EventsListView();
  #noEventsComponent = new NoEventsView();

  #eventsContainer = null;
  #eventsModel = null;
  #events = [];
  #eventPresenters = new Map();

  #currentSortType = SortType.DAY;

  #destinationsModel = null;
  #destinations = [];

  #offersModel = null;
  #offers = [];

  constructor({eventsContainer, eventsModel, destinationsModel, offersModel}) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.getEvents(this.#currentSortType)];
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderFilter();
    this.#renderSort();
    this.#renderEventsList();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleSortFormChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#events = [...this.#eventsModel.getEvents(this.#currentSortType)];
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderFilter() {
    const filterPresenter = new FilterPresenter({
      container: filtersElement,
      eventsModel: this.#eventsModel,
    });

    filterPresenter.init();
  }

  #renderSort() {
    const sortPresenter = new SortPresenter ({
      container: this.#eventsContainer,
      eventsModel: this.#eventsModel,
      onSortFormChange: this.#handleSortFormChange,
    });

    sortPresenter.init();
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventsList() {
    if (!this.#events.length) {
      render(this.#noEventsComponent, this.#eventsContainer);
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }
}
