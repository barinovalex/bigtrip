import {MONTHS} from "../const";
import Abstract from "./abstract";

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

export default class TripDay extends Abstract {
  constructor(dayNumber, date) {
    super();
    this._dayNumber = dayNumber;
    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._dayNumber, this._date);
  }

  getEventsList() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
