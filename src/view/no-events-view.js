import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../utils/filter';

const NoEventsTextType = {
  [FilterType.EMPTY]: 'Oops! Something went wrong. Please try again later',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoEventsTemplate = (filterType) => {
  const noEventsTextValue = NoEventsTextType[filterType];

  return (
    `
    <p class="trip-events__msg">${noEventsTextValue}</p>
    `
  );
};

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}
