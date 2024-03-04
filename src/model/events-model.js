import {generateEvent} from '../mock/event';

const EVENT_COUNT = 4;

export default class EventsModel {
  #events = Array.from({length: EVENT_COUNT}, generateEvent);

  get events() {
    return this.#events;
  }
}
