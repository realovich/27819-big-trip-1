import dayjs from 'dayjs';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const formatDate = (date, format) => {
  if (!date || !format) {
    return null;
  }

  return dayjs(date).format(format);
};

const calculateDuration = (dateFrom, dateTo) => {
  const duration = (dateTo - dateFrom);
  const minutes = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)).toFixed(0);
  const hours = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)).toFixed(0);
  const days = (duration / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)).toFixed(0);

  const restOfHours = hours % HOURS_PER_DAY;
  const restOfMinutes = minutes % MINUTES_PER_HOUR;

  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}M`;
  } else if (hours < HOURS_PER_DAY) {
    return `${hours}H ${restOfMinutes}M`;
  }

  return `${days}D ${restOfHours}H ${restOfMinutes}M`;
};

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const currentDate = () => dayjs();

const getRandomElements = (array, minSize, maxSize) => {

  const shuffledArray = array.sort(() => Math.random() - 0.5);

  const count = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

  return shuffledArray.slice(0, count);
};

export {getRandomArrayElement, getRandomElements, getRandomInteger, formatDate, calculateDuration, currentDate, capitalizeFirstLetter};
