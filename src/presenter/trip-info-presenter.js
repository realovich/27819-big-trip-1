import {render, replace, remove, RenderPosition} from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import {generateTripPeriod, calculateTripCost, generateTripName} from '../utils/common';

export default class TripInfoPresenter {
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;
  #tripInfoContainer = null;

  constructor({tripInfoContainer, eventsModel, destinationsModel, offersModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  #render = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      tripPeriod: generateTripPeriod(this.#eventsModel.getEvents()),
      tripCost: calculateTripCost(this.#eventsModel.getEvents(), this.#offersModel.offers),
      tripName: generateTripName(this.#eventsModel.getEvents(), this.#destinationsModel.destinations)
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #handleModelEvent = () => {
    this.#render();
  };
}
