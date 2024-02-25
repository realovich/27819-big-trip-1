import {createElement} from '../render';

const createInfoTemplate = () => `
<section class="trip-main__trip-info  trip-info"></section>
`;

export default class InfoView {
  getTemplate() {
    return createInfoTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
