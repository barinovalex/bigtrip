import {createElement} from "../utils.js";

const createRouteCostTemplate = (events) => {

  const tripPrice = events.reduce((accumulator, it) =>{
    return accumulator + it.price + it.eventType.offers.filter((offer) => offer.checked).reduce((acc, offer) => acc + offer.price, 0);
  }, 0);

  return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
            </p>`;
};

export default class RouteCost {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createRouteCostTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
