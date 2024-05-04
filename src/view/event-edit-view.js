import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {currentDate, formatDate, capitalizeFirstLetter} from '../utils/common';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  basePrice: '',
  dateFrom: currentDate(),
  dateTo: currentDate(),
  destination: null,
  type: 'taxi',
  offers: [],
};

const createEventEditOffersTemplate = (type, allOffers, eventOffers) => {
  const offersByType = allOffers.find((offer) => offer.type === type).offers;

  const setCheckedAttribute = (currentOfferId) => eventOffers.find((eventOffer) => eventOffer === currentOfferId) ? 'checked' : '';

  return offersByType.map((offer) =>
    `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${setCheckedAttribute(offer.id)} data-offer-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">Add ${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
};

const createEventEditTypesTemplate = (selectedType, allOffers) => allOffers.map((offer) =>
  `
    <div class="event__type-item">
      <input id="event-type-${offer.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}"${selectedType === offer.type ? ' checked' : ''}>
      <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-1">${capitalizeFirstLetter(offer.type)}</label>
    </div>
  `
).join('');

const createEventEditDestinationTemplate = (destination, allDestinations) => {
  const eventDestination = allDestinations.find((oneDestination) => oneDestination.id === destination);
  const eventDestinationPictures = eventDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.alt}">`).join('');

  const eventPhotosContainer = () => eventDestinationPictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventDestinationPictures}
        </div>
      </div>
  ` : '';

  return `
  <p class="event__destination-description">${eventDestination.description}</p>
  ${eventPhotosContainer()}
  `;
};

const createEventEditDestinationListTemplate = (allDestinations) => allDestinations.map((eventDestination) => `<option value="${eventDestination.name}"></option>`).join('');

const createEventEditTemplate = (event = {}, allOffers, allDestinations) => {
  const {type, dateFrom, dateTo, basePrice, destination, offers: eventOffers} = event;

  const pointDestination = allDestinations.find((oneDestination) => oneDestination.id === destination);

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
  
              ${createEventEditTypesTemplate(type, allOffers)}
            </fieldset>
          </div>
        </div>
  
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination?.name ?? ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createEventEditDestinationListTemplate(allDestinations)}
          </datalist>
        </div>
  
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, 'DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, 'DD/MM/YY HH:mm')}">
        </div>
  
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>
  
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
          <div class="event__available-offers">
          ${createEventEditOffersTemplate(type, allOffers, eventOffers)}
          </div>
        </section>
  
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          ${createEventEditDestinationTemplate(destination, allDestinations)}
        </section>
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

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({event = BLANK_EVENT, destinations, offers, onFormSubmit, onResetClick}) {
    super();

    this.#destinations = destinations;
    this.#offers = offers;

    this._setState(this.parseEventToState(event));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#offers, this.#destinations);
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
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

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

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();

    const checkedType = evt.target.textContent.toLowerCase();

    this.updateElement({
      ...this._state,
      type: checkedType,
      offers: []
    });
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

    this._setState({
      ...this._state,
      basePrice: evt.target.value
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate
    });

    this.#datepickerFrom.set('maxDate', this._state.dateTo);
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

  parseEventToState = (event) => event;

  parseStateToEvent = (state) => state;
}
