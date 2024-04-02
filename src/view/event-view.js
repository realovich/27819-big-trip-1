import AbstractView from '../framework/view/abstract-view';
import {calculateDuration, formatDate} from '../utils/common.js';

const createOffersListTemplate = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map(({title, price}) => `
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>
    `).join('')}
    </ul>
  `;
};

const createEventTemplate = (event) => {
  const {type, dateFrom, dateTo, basePrice, isFavorite, destination, offers} = event;

  const favoriteClassName = isFavorite ? ' event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${formatDate(dateFrom, 'YYYY-MM-DD')}">${formatDate(dateFrom, 'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(dateFrom, 'YYYY-MM-DDTHH:mm')}">${formatDate(dateFrom, 'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDate(dateTo, 'YYYY-MM-DDTHH:mm')}">${formatDate(dateTo, 'HH:mm')}</time>
        </p>
        <p class="event__duration">${calculateDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${createOffersListTemplate(offers)}
      <button class="event__favorite-btn${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class EventView extends AbstractView {
  #event = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({event, onEditClick, onFavoriteClick}) {
    super();
    this.#event = event;
    this.#handleRollupClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
