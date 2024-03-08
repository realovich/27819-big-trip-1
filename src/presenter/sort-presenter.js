import SortView from '../view/sort-view';
import {render} from '../framework/render';

export default class SortPresenter {
  #container = null;

  #events = [];

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#events = eventsModel;
  }

  init() {
    if (this.#events.length !== 0) {
      render(new SortView(), this.#container);
    }
  }
}
