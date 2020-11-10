import {MONTHS} from "../const";
import {createElement} from "../utils";

const createTripDayTemplate = (dayNumber, date) => {
  return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${dayNumber}</span>
                <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
              </div>

              <ul class="trip-events__list">
              </ul>
            </li>`;
};

export default class TripDay {
  constructor(dayNumber, date) {
    this._element = null;
    this._dayNumber = dayNumber;
    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._dayNumber, this._date);
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
