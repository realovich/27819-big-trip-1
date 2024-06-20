import AbstractView from '../framework/view/abstract-view';

const createInfoMainTemplate = (tripPeriod, tripCost, tripName) => `
<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${tripName}</h1>

    <p class="trip-info__dates">${tripPeriod}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
  </p>
</section>
`;

export default class TripInfoView extends AbstractView {
  #tripPeriod = null;
  #tripCost = null;
  #tripName = null;
  constructor({tripPeriod, tripCost, tripName}) {
    super();

    this.#tripPeriod = tripPeriod;
    this.#tripCost = tripCost;
    this.#tripName = tripName;
  }

  get template() {
    return createInfoMainTemplate(this.#tripPeriod, this.#tripCost, this.#tripName);
  }
}
