import {MONTHS} from "../const";

export const createTripDayTemplate = (dayNumber, date) => {
  return (`
            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${dayNumber}</span>
                <time class="day__date" datetime="2019-03-18">${MONTHS[date.getMonth()]} ${date.getDate()}</time>
              </div>

              <ul class="trip-events__list">
              </ul>
            </li>
  `);
};
