import dayjs from 'dayjs';

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};

const calculateDuration = (event) => {
  const dateFrom = dayjs(event.dateFrom);
  const dateTo = dayjs(event.dateTo);
  return dateTo.diff(dateFrom, 'seconds');
};

const sortEventsByDay = (eventA, eventB) => dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));

const sortEventsByDuration = (eventA, eventB) => calculateDuration(eventA) - calculateDuration(eventB);

const sortEventsByPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const sort = {
  [SortType.DAY]: (events) => events.sort(sortEventsByDay),
  [SortType.TIME]: (events) => events.sort(sortEventsByDuration),
  [SortType.PRICE]: (events) => events.sort(sortEventsByPrice),
};

export {SortType, sort};
