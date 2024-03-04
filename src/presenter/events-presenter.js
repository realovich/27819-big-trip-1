import EventsListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';
import {generateOffers} from '../mock/offers';
import {generateDestinations} from '../mock/destinations';
import {render, replace} from '../framework/render';

export default class EventsPresenter {
  #eventsComponent = new EventsListView();

  #eventsContainer = null;
  #eventsModel = null;

  #events = [];

  constructor({eventsContainer, eventsModel}) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    render(this.#eventsComponent, this.#eventsContainer);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderEvent(event) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      event,
      onRollupClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditComponent = new EventEditView({
      event,
      generateOffers,
      generateDestinations,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceFormToCard() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#eventsComponent.element);
  }
}
