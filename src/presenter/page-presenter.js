import NoEventsView from '../view/no-events-view';
import EventsListView from '../view/events-list-view';
import SortPresenter from './sort-presenter';
import EventPresenter from './event-presenter';
import NewEventPresenter from './new-event-presenter';
import {remove, render} from '../framework/render';
import {SortType} from '../utils/sort';
import {UpdateType, UserAction} from '../utils/const';
import {filter, FilterType} from '../utils/filter';

export default class PagePresenter {
  #eventsListComponent = new EventsListView();
  #noEventsComponent = null;

  #eventsContainer = null;
  #eventsModel = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;

  #filterModel = null;
  #filterType = FilterType.EVERYTHING;

  #currentSortType = SortType.DAY;

  #destinationsModel = null;
  #destinations = [];

  #offersModel = null;
  #offers = [];

  constructor({eventsContainer, eventsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy}) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  getEvents(sortType) {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.getEvents(sortType);
    const filteredEvents = filter[this.#filterType](events);

    return filteredEvents;
  }

  init() {
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderSort();
    this.#renderBoard();
  }

  createEvent() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortFormChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    const sortPresenter = new SortPresenter ({
      container: this.#eventsContainer,
      eventsModel: this.#eventsModel,
      onSortFormChange: this.#handleSortFormChange,
    });

    sortPresenter.init();
  }

  #renderNoEvents() {
    this.#noEventsComponent = new NoEventsView({
      filterType: this.#filterType
    });

    render(this.#noEventsComponent, this.#eventsContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderBoard() {
    if (!this.getEvents().length) {
      this.#renderNoEvents();
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);

    for (let i = 0; i < this.getEvents(this.#currentSortType).length; i++) {
      this.#renderEvent(this.getEvents(this.#currentSortType)[i]);
    }
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
