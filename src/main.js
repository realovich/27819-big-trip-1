import FilterView from './view/filter-view';
import InfoView from './view/info-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import SortView from './view/sort-view';
import { render, RenderPosition } from './render';
import EventsPresenter from './presenter/events-presenter';

const MainElement = document.querySelector('.trip-main');
const ControlsFiltersElement = MainElement.querySelector('.trip-controls__filters');

render(new InfoView(), MainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), ControlsFiltersElement);

const InfoElement = MainElement.querySelector('.trip-info');
render(new InfoMainView(), InfoElement);
render(new InfoCostView(), InfoElement);

const TripEventsElement = document.querySelector('.trip-events');
render(new SortView(), TripEventsElement);

const eventsPresenter = new EventsPresenter({eventsContainer: TripEventsElement});

eventsPresenter.init();
