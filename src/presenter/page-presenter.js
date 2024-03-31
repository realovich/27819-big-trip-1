import NoEventsView from '../view/no-events-view';
import EventsListView from '../view/events-list-view';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
import EventPresenter from './event-presenter';
import {render} from '../framework/render';

const filtersElement = document.querySelector('.trip-controls__filters');

export default class PagePresenter {
  #eventsListComponent = new EventsListView();
  #noEventsComponent = new NoEventsView();

  #eventsContainer = null;
  #eventsModel = null;
  #events = [];

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
    this.#events = [...this.#eventsModel.events];
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderFilter();
    this.#renderSort();
    this.#renderEventsList();

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

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
    });

    sortPresenter.init();
  }

  #renderEventsList() {
    if (this.#events.length === 0) {
      render(this.#noEventsComponent, this.#eventsContainer);
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    eventPresenter.init(event);
  }
}
