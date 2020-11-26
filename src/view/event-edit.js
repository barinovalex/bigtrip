import {eventTypes} from "../mock/event";
import {upCaseFirst, humanizeDateInput} from "../utils/common.js";
import {NAME_PLACES} from "../mock/place.js";
import {generatePlace} from "../mock/place";
import Smart from "./smart";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const getCheckedOffers = (offers) => {
  const checkedOffers = {};
  offers.forEach((it) => {
    checkedOffers[it.name] = false;
  });
  return checkedOffers;
};

const BLANK_EVENT = {
  eventType: eventTypes[0],
  checkedOffers: getCheckedOffers(eventTypes[0].offers),
  finishDate: new Date(),
  startDate: new Date(),
  price: 0,
  place: {},
  isFavorite: false,
  newEvent: true,
};

const createEditEventTypeTemplate = (event, eventType) => {
  return `<div class="event__type-item">
                              <input id="event-type-${eventType.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.name}"
                              ${eventType.name === event.name ? `checked` : ``}">
                              <label class="event__type-label  event__type-label--${eventType.name}" for="event-type-${eventType.name}-1">${upCaseFirst(eventType.name)}</label>
                            </div>`;
};

const createEditEventOfferTemplate = (eventOffer, checkedOffers) => {
  const {name, description, price} = eventOffer;
  const checked = checkedOffers === undefined ? false : checkedOffers[name];
  return `<div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" data-offer-name="${name}" type="checkbox" name="event-offer-${name}" ${checked ? `checked` : ``}>
                            <label class="event__offer-label" for="event-offer-${name}-1">
                              <span class="event__offer-title">${description}</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">${price}</span>
                            </label>
                          </div>`;
};

const createEventFormTemplate = (tripEvent) => {

  const {
    eventType,
    checkedOffers,
    finishDate,
    startDate,
    price,
    place: {name: placeName, description, photos},
    isFavorite,
    newEvent,
  } = tripEvent;
  const {name: eventTypeName, action, offers, iconURL} = eventType;

  return `<header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="${iconURL}" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Transfer</legend>
                               ${eventTypes.filter((it) => it.action === `to`).map((it) => createEditEventTypeTemplate(eventType, it)).join(`\n`)}
                          </fieldset>

                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Activity</legend>

                               ${eventTypes.filter((it) => it.action === `in`).map((it) => createEditEventTypeTemplate(eventType, it)).join(`\n`)}
                          </fieldset>
                        </div>
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${upCaseFirst(eventTypeName)} ${action}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${placeName ? placeName : ``}" list="destination-list-1">
                        <datalist id="destination-list-1">
                          ${NAME_PLACES.map((it) => `<option value="${it}"></option>`).join(`\n`)}
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateInput(startDate)}">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateInput(finishDate)}">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">Delete</button>

                      ${newEvent ? `` : `
                      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
                      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                        </svg>
                      </label>

                      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
                      </button>`}
                    </header>
                    ${(offers && offers.length) ? `
                    <section class="event__details">
                      <section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                        <div class="event__available-offers">
                          ${offers.map((it) => createEditEventOfferTemplate(it, checkedOffers)).join(`\n`)}
                        </div>
                      </section>
                    </section>` : ``}
                    ${(description || photos) ? `
                    <section class="event__section  event__section--destination">
                      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                      <p class="event__destination-description">${description}</p>
                      ${photos.length > 0 ? `
                      <div class="event__photos-container">
                        <div class="event__photos-tape">
                          ${photos.map((it) => `<img class="event__photo" src="${it}" alt="Event photo">`)}
                        </div>
                      </div>
                      ` : ``}
                    </section>` : ``}`;
};

const createEditEventFormTemplate = (event) => {
  return `<li class="trip-events__item">
                  <form class="event  event--edit" action="#" method="post">
                    ${createEventFormTemplate(event)}
                  </form>
                </li>`;
};

const createNewEventFormTemplate = (event) => {
  return `<form class="trip-events__item event event--edit" action="#" method="post">
                    ${createEventFormTemplate(event)}
                  </form>`;
};

export default class EventForm extends Smart {
  constructor(event = BLANK_EVENT) {
    super();
    this._event = event;
    this._data = EventForm.parseEventToData(event);
    this._datepickerStart = null;
    this._datepickerFinish = null;
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._finishDateChangeHandler = this._finishDateChangeHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._eventDestinationToggleHandler = this._eventDestinationToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._eventOfferToggleHandler = this._eventOfferToggleHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  reset(tripEvent = this._event) {
    this.updateData(
        EventForm.parseEventToData(tripEvent)
    );
  }

  _setDatepicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerFinish) {
      this._datepickerFinish.destroy();
      this._datepickerFinish = null;
    }

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`input[name = event-start-time]`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time_24hr: true,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler // На событие flatpickr передаём наш колбэк
        }
    );

    this._datepickerFinish = flatpickr(
        this.getElement().querySelector(`input[name = event-end-time]`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time_24hr: true,
          defaultDate: this._data.finishDate,
          onChange: this._finishDateChangeHandler // На событие flatpickr передаём наш колбэк
        }
    );
  }

  _startDateChangeHandler([userStartDate]) {
    this.updateData({
      startDate: userStartDate
    });
  }

  _finishDateChangeHandler([userFinishDate]) {
    this.updateData({
      finishDate: userFinishDate
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  _setInnerHandlers() {
    Array.from(this.getElement().querySelectorAll(`input[name=event-type]`))
      .forEach((it) => it.addEventListener(`click`, this._eventTypeToggleHandler));

    this.getElement()
      .querySelector(`input[name=event-destination]`)
      .addEventListener(`change`, this._eventDestinationToggleHandler);

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);

    Array.from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .forEach((it) => it.addEventListener(`click`, this._eventOfferToggleHandler));
  }

  _eventTypeToggleHandler(evt) {
    const newEventType = eventTypes.find((it) => (it.name === evt.target.value));
    this.updateData({
      eventType: newEventType,
      checkedOffers: getCheckedOffers(newEventType.offers),
    });
  }

  _eventOfferToggleHandler(evt) {
    const updateCheckedOffers = Object.assign(
        {},
        this._data.checkedOffers,
        {[evt.target.dataset.offerName]: !this._data.checkedOffers[evt.target.dataset.offerName]}
    );
    this.updateData({
      checkedOffers: updateCheckedOffers
    }, true);
  }

  _eventDestinationToggleHandler() {
    this.updateData({
      place: generatePlace()
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  getTemplate() {
    if (this._data.newEvent) {
      return createNewEventFormTemplate(this._data);
    } else {
      return createEditEventFormTemplate(this._data);
    }
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this.reset();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  static parseEventToData(tripEvent) {
    return Object.assign(
        {},
        tripEvent
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    return data;
  }
}
