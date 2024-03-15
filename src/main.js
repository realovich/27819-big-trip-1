import InfoView from './view/info-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import {render, RenderPosition} from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import SortPresenter from './presenter/sort-presenter';
import EventsPresenter from './presenter/events-presenter';
import EventsModel from './model/events-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const mainElement = document.querySelector('.trip-main');
const filtersElement = mainElement.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');

render(new InfoView(), mainElement, RenderPosition.AFTERBEGIN);

const infoElement = mainElement.querySelector('.trip-info');
render(new InfoMainView(), infoElement);
render(new InfoCostView(), infoElement);

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  eventsModel,
});

const sortPresenter = new SortPresenter ({
  container: eventsElement,
  eventsModel,
});

const eventsPresenter = new EventsPresenter({
  container: eventsElement,
  eventsModel,
  destinationsModel,
  offersModel
});

filterPresenter.init();
sortPresenter.init();
eventsPresenter.init();
