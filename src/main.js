<<<<<<< Updated upstream
=======
import FilterView from './view/filter-view';
import InfoView from './view/info-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import SortView from './view/sort-view';
import { render, RenderPosition } from './render';
import EventsPresenter from './presenter/events-presenter';
import EventsModel from './model/events-model';

const mainElement = document.querySelector('.trip-main');
const filtersElement = mainElement.querySelector('.trip-controls__filters');

render(new InfoView(), mainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filtersElement);

const infoElement = mainElement.querySelector('.trip-info');
render(new InfoMainView(), infoElement);
render(new InfoCostView(), infoElement);

const eventsElement = document.querySelector('.trip-events');
render(new SortView(), eventsElement);

const eventsModel = new EventsModel();

const eventsPresenter = new EventsPresenter({
  eventsContainer: eventsElement,
  eventsModel,
});

eventsPresenter.init();
>>>>>>> Stashed changes
