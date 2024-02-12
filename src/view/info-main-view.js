import {createElement} from '../render';

const createInfoMainTemplate = () => `
<div class="trip-info__main">
  <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

  <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
</div>
`;

export default class InfoMainView {
  getTemplate() {
    return createInfoMainTemplate();
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
