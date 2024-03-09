import { generateOffers } from './offers';
import { generateDestinations } from './destinations';
import {getRandomArrayElement, getRandomInteger, getRandomElements, generateFutureDate, generatePastDate} from '../utils/common';

const generateEvent = () => {
  const offerType = getRandomArrayElement(generateOffers);

  return {
    type: offerType.type,
    basePrice: getRandomInteger(80, 160),
    dateFrom: generatePastDate(),
    dateTo: generateFutureDate(),
    destination: getRandomArrayElement(generateDestinations),
    offers: getRandomElements(offerType.offers, 1, 2),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generateEvent};
