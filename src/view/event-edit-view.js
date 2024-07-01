import flatpickr from 'flatpickr';

import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {capitalizeFirstLetter} from '../utils/common';
import {EditType} from '../utils/const';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  destination: null,
  type: 'taxi',
  offers: [],
  isFavorite: false,
};

const createEventEditTypesTemplate = (selectedType, allOffers, isDisabled) =>
  allOffers.reduce((template, offer) => `${template}
    <div class="event__type-item">
      <input id="event-type-${offer.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}"${selectedType === offer.type ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
      <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-1">${capitalizeFirstLetter(offer.type)}</label>
    </div>`, '');

const createEventEditDestinationListTemplate = (allDestinations) =>
  allDestinations.reduce((template, eventDestination) => `${template}
    <option value="${eventDestination.name}"></option>`, '');

const createEventEditOffersTemplate = (type, allOffers, eventOffers, isDisabled) => {
  const offersByType = allOffers.find((offer) => offer.type === type).offers;

  const setCheckedAttribute = (currentOfferId) => eventOffers.find((eventOffer) => eventOffer === currentOfferId) ? 'checked' : '';

  const offersList = offersByType.reduce((template, offer) =>
    `${template}
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${setCheckedAttribute(offer.id)} data-offer-id="${offer.id}"${isDisabled ? ' disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `, '');

  if (!offersList) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${offersList}
      </div>
    </section>
  `;
};

const createEventEditDestinationTemplate = (destination, allDestinations) => {
  const eventDestination = allDestinations.find((oneDestination) => oneDestination.id === destination);
  const eventDestinationPictures = eventDestination ? eventDestination.pictures.reduce((template, picture) => `${template}<img class="event__photo" src="${picture.src}" alt="${picture.alt}">`, '') : [];

  const eventPhotosContainer = () => eventDestinationPictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventDestinationPictures}
        </div>
      </div>
  ` : '';

  if (!destination) {
    return '';
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventDestination?.description ?? ''}</p>
      ${eventPhotosContainer()}
    </section>
  `;
};

const createEventEditTemplate = ({event = {}, allOffers, allDestinations, formType}) => {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    destination,
    offers: eventOffers,
    isDisabled,
    isSaving,
    isDeleting
  } = event;

  const pointDestination = allDestinations.find((oneDestination) => oneDestination.id === destination);

  const ResetButtonLabel = {
    [EditType.EDITING]: 'Delete',
    [EditType.CREATING]: 'Cancel'
  };

  const rollupButtonTemplate = `
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  `;

  return /*html*/`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
  
              ${createEventEditTypesTemplate(type, allOffers, isDisabled)}
            </fieldset>
          </div>
        </div>
  
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination?.name ?? ''}" list="destination-list-1" required${isDisabled ? ' disabled' : ''}>
          <datalist id="destination-list-1">
            ${createEventEditDestinationListTemplate(allDestinations)}
          </datalist>
        </div>
  
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" required${isDisabled ? ' disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" required${isDisabled ? ' disabled' : ''}>
        </div>
  
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required${isDisabled ? ' disabled' : ''}>
        </div>
  
        <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? ' disabled' : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset"${isDisabled ? ' disabled' : ''}>${isDeleting ? 'Deleting...' : ResetButtonLabel[formType]}</button>
        ${(formType !== EditType.CREATING) ? rollupButtonTemplate : ''}
      </header>
      <section class="event__details">
        ${createEventEditOffersTemplate(type, allOffers, eventOffers, isDisabled)}
  
        ${createEventEditDestinationTemplate(destination, allDestinations)}
      </section>
    </form>
  </li>
  `;
};

export default class EventEditView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;

  #handleFormSubmit = null;
  #handleResetClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  #formType = null;

  constructor({event = BLANK_EVENT, destinations, offers, onFormSubmit, onResetClick, onDeleteClick, formType = EditType.EDITING}) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;

    this._setState(this.parseEventToState(event));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;

    this.#formType = formType;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate({
      event: this._state,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      formType: this.#formType
    });
  }

  reset(event) {
    this.updateElement(
      this.parseEventToState(event),
    );
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers() {

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    if (this.#formType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetClickHandler);
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteButtonClickHandler);
    }

    if (this.#formType === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetClickHandler);
    }

    const offersBlock = this.element.querySelector('.event__available-offers');

    if (offersBlock) {
      offersBlock.addEventListener('change', this.#offersChangeHandler);
    }

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatePickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.parseStateToEvent(this._state));
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this.parseStateToEvent(this._state));
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('event__type-label')) {
      const checkedType = evt.target.textContent.toLowerCase();

      this.updateElement({
        ...this._state,
        type: checkedType,
        offers: []
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const updatedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    const updatedDestinationId = (updatedDestination) ? updatedDestination.id : null;

    this.updateElement({
      ...this._state,
      destination: updatedDestinationId
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();

    const checkedOffers = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked')
    );

    this._setState({
      ...this._state,
      offers: checkedOffers.map((element) => element.dataset.offerId)
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    const value = Number(evt.target.value);

    if(!Number.isInteger(value) || value <= 0) {
      evt.target.value = this._state.basePrice;
      return;
    }

    this._setState({
      ...this._state,
      basePrice: value
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        ...this._state,
        dateFrom: userDate
      });

      this.#datepickerTo.set('minDate', this._state.dateFrom);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        ...this._state,
        dateTo: userDate
      });

      this.#datepickerFrom.set('maxDate', this._state.dateTo);
    }
  };

  #setDatePickers() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const mainDatepickerSettings = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...mainDatepickerSettings,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...mainDatepickerSettings,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      }
    );
  }

  parseEventToState = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  parseStateToEvent = (state) => {
    const event = {...state};

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  };
}
