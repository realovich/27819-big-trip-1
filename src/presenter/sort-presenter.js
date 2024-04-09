import SortView from '../view/sort-view';
import {SortType} from '../utils/sort';
import {render} from '../framework/render';

export default class SortPresenter {
  #container = null;
  #sortComponent = null;
  #eventsModel = null;

  #currentSortType = SortType.DAY;

  #events = [];

  constructor({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.getEvents(this.#currentSortType)];

    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (this.#events.length === 0) {
      return;
    }

    render(this.#sortComponent, this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    console.log(sortType);
  };
}
