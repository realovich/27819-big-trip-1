import {generateDestinations} from '../mock/destinations';

export default class DestinationsModel {
  #destinations = generateDestinations();

  get destinations() {
    return this.#destinations;
  }
}
