import {generateEvent} from '../mock/event';
import { sort } from '../utils/sort';

const EVENT_COUNT = 4;

export default class EventsModel {
  #events = Array.from({length: EVENT_COUNT}, generateEvent);

  getEvents(sortType) {
    const sortedEvents = [...this.#events];

    if (sortType) {
      sort[sortType](sortedEvents);
      return sortedEvents;
    }

    return this.#events;
  }
}
