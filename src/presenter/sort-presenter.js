import SortView from '../view/sort-view';
import {SortType, sort} from '../utils/sort';
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
    this.#events = [...this.#eventsModel.events.sort(sort[this.#currentSortType])];

    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (this.#events.length === 0) {
      return;
    }

    render(this.#sortComponent, this.#container);
  }

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#events.sort(sort[SortType.DAY]);
        break;
      case SortType.TIME:
        this.#events.sort(sort[SortType.TIME]);
        break;
      case SortType.PRICE:
        this.#events.sort(sort[SortType.TIME]);
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    this.#sortEvents(sortType);

    console.log(sortType);
  };
}
