import dayjs from 'dayjs';
import { generateOffers } from './offers';
import { generateDestinations } from './destinations';
import {getRandomArrayElement, getRandomInteger, getRandomElements, currentDate} from '../utils';

const generateDate = () => {
  const minMinutesGap = 4;
  const maxMinutesGap = 4 * 24 * 60;
  const daysGap = getRandomInteger(minMinutesGap, maxMinutesGap);

  return dayjs().add(daysGap, 'minutes').toDate();
};

const generateEvent = () => {
  const offerType = getRandomArrayElement(generateOffers);

  return {
    type: offerType.type,
    basePrice: getRandomInteger(80, 160),
    dateFrom: currentDate(),
    dateTo: generateDate(),
    destination: getRandomArrayElement(generateDestinations),
    offers: getRandomElements(offerType.offers, 1, 2),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generateEvent};
