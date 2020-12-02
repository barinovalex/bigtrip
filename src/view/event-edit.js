import {upCaseFirst, humanizeDateInput} from "../utils/common.js";
import Smart from "./smart";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  eventType: `taxi`,
  offers: [],
  finishDate: new Date(),
  startDate: new Date(),
  price: 0,
  place: {},
  isFavorite: false,
  newEvent: true,
};

const createEditEventTypeTemplate = (eventTypeName, eventType) => {
  return `<div class="event__type-item">
                              <input id="event-type-${eventType.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.type}"
                              ${eventType.type === eventTypeName ? `checked` : ``}">
                              <label class="event__type-label  event__type-label--${eventType.type}" for="event-type-${eventType.type}-1">${upCaseFirst(eventType.type)}</label>
                            </div>`;
};

const createEditEventOfferTemplate = (eventOffer, eventOffers, isDisabled) => {
  const {title, price} = eventOffer;
  const name = title.toLowerCase().replace(/ /g, `-`);
  const checked = eventOffers.findIndex((it) => it.title === title) >= 0;
  return `<div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden"
                                id="event-offer-${name}-1"
                                data-offer-name="${name}"
                                type="checkbox"
                                name="event-offer-${name}"
                                ${checked ? `checked` : ``}
                                ${isDisabled ? `disabled` : ``}>
                            <label class="event__offer-label" for="event-offer-${name}-1">
                              <span class="event__offer-title">${title}</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">${price}</span>
                            </label>
                          </div>`;
};

const createEventFormTemplate = (tripEvent, destination, allOffers) => {

  const {
    eventType: eventTypeName,
    offers: eventOffers,
    finishDate,
    startDate,
    price,
    place: {name: placeName, description, pictures},
    isFavorite,
    newEvent,
    isDisabled,
    isSaving,
    isDeleting,
  } = tripEvent;

  const offers = allOffers[eventTypeName][`offers`];

  return `<header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/${eventTypeName}.png" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Transfer</legend>
                               ${Object.values(allOffers).filter((it) => it.action === `to`).map((it) => createEditEventTypeTemplate(eventTypeName, it)).join(`\n`)}
                          </fieldset>

                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Activity</legend>

                               ${Object.values(allOffers).filter((it) => it.action === `in`).map((it) => createEditEventTypeTemplate(eventTypeName, it)).join(`\n`)}
                          </fieldset>
                        </div>
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${upCaseFirst(eventTypeName)} ${allOffers[eventTypeName].action}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
                            value="${placeName ? placeName : ``}"
                            ${isDisabled ? `disabled` : ``}
                            list="destination-list-1" required>
                        <datalist id="destination-list-1">
                          ${Object.values(destination).map((it) => `<option value="${it.name}"></option>`).join(`\n`)}
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                            value="${humanizeDateInput(startDate)}"
                            ${isDisabled ? `disabled` : ``}>
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                            value="${humanizeDateInput(finishDate)}"
                            ${isDisabled ? `disabled` : ``}>
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"
                            value="${price}"
                            ${isDisabled ? `disabled` : ``}>
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>
                        ${isSaving ? `Saving...` : `Save`}
                      </button>
                      <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
                        ${isDeleting ? `deleting...` : `delete`}
                      </button>

                      ${newEvent ? `` : `
                      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
                            ${isFavorite ? `checked` : ``}
                            ${isDisabled ? `disabled` : ``}>
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
                          ${offers.map((it) => createEditEventOfferTemplate(it, eventOffers, isDisabled)).join(`\n`)}
                        </div>
                      </section>
                    </section>` : ``}
                    ${(description || pictures) ? `
                    <section class="event__section  event__section--destination">
                      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                      <p class="event__destination-description">${description}</p>
                      ${pictures.length > 0 ? `
                      <div class="event__photos-container">
                        <div class="event__photos-tape">
                          ${pictures.map(({src, description: imgDescription = ``}) => `<img class="event__photo" src="${src}" alt="${imgDescription}">`)}
                        </div>
                      </div>
                      ` : ``}
                    </section>` : ``}`;
};

const createEditEventFormTemplate = (event, destinations, offers) => {
  return `<li class="trip-events__item">
                  <form class="event  event--edit" action="#" method="post">
                    ${createEventFormTemplate(event, destinations, offers)}
                  </form>
                </li>`;
};

const createNewEventFormTemplate = (event, destinations, offers) => {
  return `<div><form class="trip-events__item event event--edit" action="#" method="post">
                    ${createEventFormTemplate(event, destinations, offers)}
                  </form></div>`;
};

export default class EventForm extends Smart {
  constructor(event = BLANK_EVENT, destinations, offers) {
    super();
    this._event = event;
    this._destinations = destinations;
    this._offers = offers;
    this._data = EventForm.parseEventToData(event);
    this._datepickerStart = null;
    this._datepickerFinish = null;
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._finishDateChangeHandler = this._finishDateChangeHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._eventDestinationToggleHandler = this._eventDestinationToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._eventOfferToggleHandler = this._eventOfferToggleHandler.bind(this);
    this._toggleFavoriteHandler = this._toggleFavoriteHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerFinish) {
      this._datepickerFinish.destroy();
      this._datepickerFinish = null;
    }
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
    if (!this._event.newEvent) {
      this.setEditClickHandler(this._callback.editClick);
    }
    this.setDeleteClickHandler(this._callback.deleteClick);
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

    if (!this._data.newEvent) {
      this.getElement()
        .querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, this._toggleFavoriteHandler);
    }

    Array.from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .forEach((it) => it.addEventListener(`click`, this._eventOfferToggleHandler));
  }

  _eventTypeToggleHandler(evt) {
    this.updateData({
      eventType: evt.target.value,
      offers: [],
    });
  }

  _eventOfferToggleHandler(evt) {
    let updateCheckedOffers = [];
    const index = this._data.offers.findIndex((it) => it.title.toLowerCase().replace(/ /g, `-`) === evt.target.dataset.offerName);
    if (index >= 0) {
      updateCheckedOffers = [
        ...this._data.offers.slice(0, index),
        ...this._data.offers.slice(index + 1)
      ];
    } else {
      updateCheckedOffers = this._data.offers.slice();
      updateCheckedOffers.push(
          this._offers[this._data.eventType].offers.find((it) => it.title.toLowerCase().replace(/ /g, `-`) === evt.target.dataset.offerName)
      );
    }
    this.updateData({
      offers: updateCheckedOffers
    }, true);
  }

  _eventDestinationToggleHandler(evt) {
    this.updateData({
      place: this._destinations[evt.target.value]
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _toggleFavoriteHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  getTemplate() {
    if (this._data.newEvent) {
      return createNewEventFormTemplate(this._data, this._destinations, this._offers);
    } else {
      return createEditEventFormTemplate(this._data, this._destinations, this._offers);
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

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parseEventToData(tripEvent) {
    return Object.assign(
        {},
        tripEvent,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }
}
