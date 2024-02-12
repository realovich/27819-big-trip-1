import EventsListView from '../view/events-list-view';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';
import {render} from '../render';

export default class EventsPresenter {
  eventsComponent = new EventsListView();

  constructor({eventsContainer}) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(this.eventsComponent, this.eventsContainer);
    render(new EventEditView(), this.eventsComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventsComponent.getElement());
    }
  }
}
