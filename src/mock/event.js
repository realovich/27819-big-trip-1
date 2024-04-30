import { generateOffers } from './offers';
import { generateDestinations } from './destinations';
import {getRandomArrayElement, getRandomInteger, getRandomElements, generateFutureDate, generatePastDate, makeIdGenerator} from '../utils/common';

const eventOffersId = [1, 2, 3, 4, 5, 6];

const generateEventId = makeIdGenerator();

const generateEvent = () => {
  const offerType = getRandomArrayElement(generateOffers);

  return {
    id: generateEventId(),
    basePrice: getRandomInteger(80, 160),
    dateFrom: generatePastDate(),
    dateTo: generateFutureDate(),
    destination: getRandomArrayElement(generateDestinations).id,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomElements(eventOffersId, 0, 2),
    type: offerType.type,
  };
};

export {generateEvent};
