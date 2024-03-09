import SortView from '../view/sort-view';
import {render} from '../framework/render';

export default class SortPresenter {
  #container = null;

  #eventsModel = null;

  #events = [];

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    if (this.#events.length === 0) {
      return;
    }

    render(new SortView(), this.#container);
  }
}
