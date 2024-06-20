import dayjs from 'dayjs';

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

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

const generateTripPeriod = (events) => {
  const dates = events.map((event) => ({
    dateFrom: dayjs(event.dateFrom),
    dateTo: dayjs(event.dateTo)
  }));

  const minDate = dates.reduce((min, item) => item.dateFrom.isBefore(min) ? item.dateFrom : min, dates[0].dateFrom);
  const maxDate = dates.reduce((max, item) => item.dateTo.isAfter(max) ? item.dateTo : max, dates[0].dateTo);

  const startMonth = minDate.format('MMM');
  const endMonth = maxDate.format('MMM');

  const startDate = minDate.format('D');
  const endDate = maxDate.format('D');

  return `${startDate} ${startMonth} — ${endDate} ${endMonth}`;
};

const calculateTripCost = (events, offers) => {
  const allOffers = offers.flatMap((category) => category.offers);

  const totalSum = events.reduce((sum, event) => {
    const totalOfferPrice = event.offers.reduce((offerSum, offerId) => {
      const offer = allOffers.find((separateOffer) => separateOffer.id.toString() === offerId);
      return offer ? offerSum + offer.price : offerSum;
    }, 0);
    return sum + event.basePrice + totalOfferPrice;
  }, 0);

  return totalSum;
};

const generateTripName = (events, destinations) => {
  const sortedEvents = events.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

  const destinationIds = [...new Set(sortedEvents.flatMap((event) => event.destination))];

  const destinationNames = destinationIds.map((id) => {
    const destination = destinations.find((separateDestination) => separateDestination.id === id);
    return destination ? destination.name : '';
  }).filter((name) => name);

  if (destinationNames.length <= 3) {
    return destinationNames.join(' &mdash; ');
  }

  return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
};

export {formatDate, calculateDuration, capitalizeFirstLetter, generateTripPeriod, calculateTripCost, generateTripName};
