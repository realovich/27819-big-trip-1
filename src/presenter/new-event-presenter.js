import {remove, render, RenderPosition} from '../framework/render';
import EventEditView from '../view/event-edit-view';
import {UserAction, UpdateType, EditType} from '../utils/const';

export default class NewEventPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #resetCreating = null;

  #destinationsModel = null;
  #offersModel = null;

  #eventEditComponent = null;

  constructor({eventsListContainer, onDataChange, onDestroy, destinationsModel, offersModel, resetCreating}) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#resetCreating = resetCreating;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView({
      onFormSubmit: this.#handleFormSubmit,
      onResetClick: this.#handleResetClick,
      onDeleteClick: this.#handleDeleteClick,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      formType: EditType.CREATING
    });

    render(this.#eventEditComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

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

    this.#resetCreating();
  }

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleResetClick = () => {
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
