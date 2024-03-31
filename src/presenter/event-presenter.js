import EventView from '../view/event-view';
import EventEditView from '../view/event-edit-view';

import {render, replace} from '../framework/render';

export default class EventPresenter {
  #eventsListContainer = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;

  #destinationsModel = null;
  #destinations = [];

  #offersModel = null;
  #offers = [];

  constructor({eventsListContainer, destinationsModel, offersModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(event) {
    this.#event = event;
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#eventComponent = new EventView({
      event: this.#event,
      onEditClick: this.#handleEditClick,
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleResetClick,
    });

    render(this.#eventComponent, this.#eventsListContainer);
  }

  #replaceCardToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick() {
    this.#replaceCardToForm();
  }

  #handleResetClick() {
    this.#replaceFormToCard();
  }

  #handleFormSubmit() {
    this.#replaceFormToCard();
  }
}
