import {generateEvent} from '../mock/event';
import { sort } from '../utils/sort';

const EVENT_COUNT = 4;

export default class EventsModel {
  #events = Array.from({length: EVENT_COUNT}, generateEvent);

  get events() {
    return this.#events;
  }

  getEvents(sortType) {
    this.#events.sort(sort[sortType]);
    return this.#events;
  }
}
