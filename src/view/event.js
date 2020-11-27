import {upCaseFirst, humanizeTime, humanizeDateSpread} from "../utils/common.js";
import Abstract from "./abstract";
import he from "he";

const createEventOfferTemplate = (offer) => {
  const {name, price} = offer;

  return `<li class="event__offer">
                        <span class="event__offer-title">${name}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${price}</span>
                       </li>`;
};

const createEventTemplate = (tripEvent) => {
  const {eventType, startDate, finishDate, price, place: {name: placeName}, checkedOffers} = tripEvent;
  const {name: eventTypeName, action, offers, iconURL} = eventType;

  return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="${iconURL}" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${upCaseFirst(eventTypeName)} ${action} ${he.encode(placeName)}</h3>

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
                          ${offers.filter((it) => checkedOffers[it.name]).slice(0, 3).map(createEventOfferTemplate).join(`\n`)}
                      </ul>
                    ` : ``}

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
};

export default class TripEvent extends Abstract {
  constructor(tripEvent) {
    super();
    this._event = tripEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}

