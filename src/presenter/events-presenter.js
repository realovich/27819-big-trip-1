import NoEventsView from '../view/no-events-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import EventEditView from '../view/event-edit-view';
import {generateOffers} from '../mock/offers';
import {generateDestinations} from '../mock/destinations';
import {render, replace} from '../framework/render';

export default class EventsPresenter {
  #eventsComponent = new EventsListView();
  #noEventsComponent = new NoEventsView();

  #eventsContainer = null;
  #eventsModel = null;

  #events = [];

  constructor({container, eventsModel}) {
    this.#eventsContainer = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    this.#renderEventsList();

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderEventsList() {
    if (this.#events.length === 0) {
      render(this.#noEventsComponent, this.#eventsContainer);
      return;
    }

    render(this.#eventsComponent, this.#eventsContainer);
  }

  #renderEvent(event) {
    const eventComponent = new EventView({
      event,
      onEditClick: editClickHandler
    });

    const eventEditComponent = new EventEditView({
      event,
      generateOffers,
      generateDestinations,
      onFormSubmit: formSubmitHandler,
      onResetClick: resetClickHandler
    });

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function editClickHandler() {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function formSubmitHandler() {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function resetClickHandler() {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function replaceCardToForm() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceFormToCard() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#eventsComponent.element);
  }
}
