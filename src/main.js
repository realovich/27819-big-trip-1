import InfoView from './view/info-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import {render, RenderPosition} from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import SortPresenter from './presenter/sort-presenter';
import EventsPresenter from './presenter/events-presenter';
import EventsModel from './model/events-model';

const mainElement = document.querySelector('.trip-main');
const filtersElement = mainElement.querySelector('.trip-controls__filters');

render(new InfoView(), mainElement, RenderPosition.AFTERBEGIN);

const infoElement = mainElement.querySelector('.trip-info');
render(new InfoMainView(), infoElement);
render(new InfoCostView(), infoElement);

const eventsElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();

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
});

filterPresenter.init();
sortPresenter.init();
eventsPresenter.init();
