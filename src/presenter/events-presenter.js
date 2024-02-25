import EventsListView from '../view/event-list-view';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';
import {generateOffers} from '../mock/offers';
import {generateDestinations} from '../mock/destinations';
import {render} from '../render';

export default class EventsPresenter {
  eventsComponent = new EventsListView();

  constructor({eventsContainer, eventsModel}) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
  }

  init() {
    this.events = [...this.eventsModel.getEvents()];

    render(this.eventsComponent, this.eventsContainer);
    render(new EventEditView({event: this.events[0], generateOffers, generateDestinations}), this.eventsComponent.getElement());

    for (let i = 1; i < this.events.length; i++) {
      render(new EventView({event: this.events[i]}), this.eventsComponent.getElement());
    }
  }
}
