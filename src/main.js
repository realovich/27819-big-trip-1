import InfoView from './view/info-view';
import InfoMainView from './view/info-main-view';
import InfoCostView from './view/info-cost-view';
import {render, RenderPosition} from './framework/render';
import PagePresenter from './presenter/page-presenter';
import EventsModel from './model/events-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const mainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');

render(new InfoView(), mainElement, RenderPosition.AFTERBEGIN);

const infoElement = mainElement.querySelector('.trip-info');
render(new InfoMainView(), infoElement);
render(new InfoCostView(), infoElement);

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const pagePresenter = new PagePresenter({
  eventsContainer: eventsElement,
  eventsModel,
  destinationsModel,
  offersModel
});

pagePresenter.init();
