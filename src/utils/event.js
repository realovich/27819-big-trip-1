import dayjs from 'dayjs';

const isEventFuture = (event) => dayjs().isBefore(event.dateFrom);

const isEventPresent = (event) => (dayjs().isAfter(event.dateFrom) && dayjs().isBefore(event.dateTo));

const isEventPast = (event) => dayjs().isAfter(event.dateTo);

export {isEventFuture, isEventPresent, isEventPast};
