import {remove, render} from '../framework/render';
import EventEditView from '../view/event-edit-view';
import {UserAction, UpdateType} from '../utils/const';
import {nanoid} from 'nanoid';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #destinations = [];
  #offers = [];

  #eventEditComponent = null;

  constructor({eventsListContainer, onDataChange, onDestroy, destinations, offers}) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#destinations = destinations;
    this.offers = offers;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    render(this.#eventEditComponent, this.#eventsListContainer);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: nanoid(), ...event},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
