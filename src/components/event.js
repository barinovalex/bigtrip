import {upCaseFirst, humanizeTime, humanizeDateSpread} from "../utils.js";
import {createElement} from "../utils";

const createEventOfferTemplate = (offer) => {
  const {name, price} = offer;

  return `<li class="event__offer">
                        <span class="event__offer-title">${name}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${price}</span>
                       </li>`;
};

const createEventTemplate = (event) => {
  const {startDate, finishDate, price, place: {name: placeName}} = event;
  const {name: eventTypeName, action, offers, iconURL} = event.eventType;

  return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="${iconURL}" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${upCaseFirst(eventTypeName)} ${action} ${placeName}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-19T11:20">${humanizeTime(startDate)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="2019-03-19T13:00">${humanizeTime(finishDate)}</time>
                      </p>
                      <p class="event__duration">${humanizeDateSpread(startDate, finishDate)}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${price}</span>
                    </p>
                    ${offers.length > 0 ? `
                      <h4 class="visually-hidden">Offers:</h4>
                      <ul class="event__selected-offers">
                          ${offers.filter((it) => it.checked).slice(0, 3).map(createEventOfferTemplate).join(`\n`)}
                      </ul>
                    ` : ``}

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
};

export default class TripEvent {
  constructor(event) {
    this._element = null;
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
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

