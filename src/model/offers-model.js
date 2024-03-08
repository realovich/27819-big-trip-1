import {generateOffers} from '../mock/offers';

export default class OffersModel {
  #offers = generateOffers;

  get offers() {
    return this.#offers;
  }
}
