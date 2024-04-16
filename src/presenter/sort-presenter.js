import SortView from '../view/sort-view';
import {SortType} from '../utils/sort';
import {render} from '../framework/render';

export default class SortPresenter {
  #container = null;
  #sortComponent = null;
  #eventsModel = null;

  #handleSortFormChange = null;
  #currentSortType = SortType.DAY;

  #events = [];

  constructor({container, eventsModel, onSortFormChange}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#handleSortFormChange = onSortFormChange;
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
    this.#currentSortType = sortType;
    this.#handleSortFormChange(sortType);
  };
}
