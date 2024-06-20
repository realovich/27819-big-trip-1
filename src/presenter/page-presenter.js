import NoEventsView from '../view/no-events-view';
import LoadingView from '../view/loading-view';
import EventsListView from '../view/events-list-view';
import TripInfoPresenter from '../presenter/trip-info-presenter';
import SortPresenter from './sort-presenter';
import EventPresenter from './event-presenter';
import NewEventPresenter from './new-event-presenter';
import {remove, render} from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {SortType} from '../utils/sort';
import {UpdateType, UserAction} from '../utils/const';
import {filter, FilterType} from '../utils/filter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PagePresenter {
  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #noEventsComponent = null;

  #mainContainer = null;
  #eventsContainer = null;
  #eventsModel = null;
  #tripInfoPresenter = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #sortPresenter = null;

  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #isCreating = false;
  #isLoading = true;

  #currentSortType = SortType.DAY;

  #destinationsModel = null;
  #destinations = [];

  #offersModel = null;
  #offers = [];

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({mainContainer, eventsContainer, eventsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy}) {
    this.#mainContainer = mainContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#tripInfoPresenter = new TripInfoPresenter({
      tripInfoContainer: this.#mainContainer,
      eventsModel: this.#eventsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#sortPresenter = new SortPresenter({
      container: this.#eventsContainer,
      eventsModel: this.#eventsModel,
      onSortFormChange: this.#handleSortFormChange,
    });

    this.#newEventPresenter = new NewEventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      resetCreating: this.#resetCreating,
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

    this.#renderBoard();
  }

  createEvent() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortFormChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderTripInfo() {
    this.#tripInfoPresenter.init();
  }

  #renderSort() {
    this.#sortPresenter.destroy();
    this.#sortPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderNoEventsIfNeeded() {
    if (!this.getEvents().length && !this.#isCreating) {
      this.#noEventsComponent = new NoEventsView({
        filterType: this.#filterType
      });

      render(this.#noEventsComponent, this.#eventsContainer);

      this.#sortPresenter.destroy();
    }
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
    this.#renderTripInfo();
    this.#renderSort();
    render(this.#eventsListComponent, this.#eventsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderNoEventsIfNeeded();

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

  #resetCreating = () => {
    this.#isCreating = false;
    this.#renderNoEventsIfNeeded();
  };
}
