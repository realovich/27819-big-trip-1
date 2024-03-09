import AbstractView from '../framework/view/abstract-view';
import {currentDate, formatDate, capitalizeFirstLetter, replaceSpaceAndLowercase} from '../utils/common';

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

  const setCheckedAttribute = (currentOfferId) => eventOffers.find((eventOffer) => eventOffer.id === currentOfferId) ? 'checked' : '';

  return offersByType.map((offer, index) =>
    `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${replaceSpaceAndLowercase(offer.title)}-${index}" type="checkbox" name="event-offer-${replaceSpaceAndLowercase(offer.title)}" ${setCheckedAttribute(offer.id)}>
      <label class="event__offer-label" for="event-offer-${replaceSpaceAndLowercase(offer.title)}-${index}">
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
  const eventDestination = allDestinations.find((oneDestination) => oneDestination === destination);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
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

export default class EventEditView extends AbstractView {
  #event = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleResetClick = null;

  constructor({event = BLANK_EVENT, generateOffers, generateDestinations, onFormSubmit, onResetClick}) {
    super();
    this.#event = event;
    this.#offers = generateOffers;
    this.#destinations = generateDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetClickHandler);
  }

  get template() {
    return createEventEditTemplate(this.#event, this.#offers, this.#destinations);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };
}
