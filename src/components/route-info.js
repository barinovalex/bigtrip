import {MONTHS} from "../const";
import {createElement} from "../utils.js";

const createRouteInfoTemplate = (events) => {
  const placesList = [];
  let currentPlace = ``;
  const startDate = events[0].startDate;
  let finishDate = new Date(0);
  for (const event of events) {
    if (currentPlace !== event.place.name) {
      placesList.push(event.place.name);
      currentPlace = event.place.name;
    }
    if (event.finishDate > finishDate) {
      finishDate = event.finishDate;
    }
  }
  let dates;
  if (startDate.getMonth() === finishDate.getMonth()) {
    dates = `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}&nbsp;&mdash;&nbsp;${finishDate.getDate()}`;
  } else {
    dates = `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}&nbsp;&mdash;&nbsp;${MONTHS[finishDate.getMonth()]} ${finishDate.getDate()}`;
  }
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${placesList.join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${dates}</p>
            </div>
          </section>`;
};

const createEmptyRouteInfoTemplate = () => {
  return `<section class="trip-main__trip-info  trip-info">
          </section>`;
};

export default class RouteInfo {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    if (this._events && this._events.length > 0) {
      return createRouteInfoTemplate(this._events);
    } else {
      return createEmptyRouteInfoTemplate();
    }

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
