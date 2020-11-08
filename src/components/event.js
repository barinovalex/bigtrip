import {upCaseFirst, humanizeTime, humanizeDateSpread} from "../utils.js";

const createEventOfferTemplate = (offer) => {
  return (`
                      <li class="event__offer">
                        <span class="event__offer-title">${offer.name}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                       </li>
  `);
};

export const createEventTemplate = (event) => {
  return (`
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="${event.eventType.iconURL}" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${upCaseFirst(event.eventType.name)} ${event.eventType.action} ${event.place.name}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-19T11:20">${humanizeTime(event.startDate)}</time>
                        &mdash;
                        <time class="event__end-time" datetime="2019-03-19T13:00">${humanizeTime(event.finishDate)}</time>
                      </p>
                      <p class="event__duration">${humanizeDateSpread(event.startDate, event.finishDate)}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${event.price}</span>
                    </p>
                    ${event.eventType.offers.length > 0 ? `
                      <h4 class="visually-hidden">Offers:</h4>
                      <ul class="event__selected-offers">
                          ${event.eventType.offers.filter((it) => it.checked).slice(0, 3).map(createEventOfferTemplate).join(`\n`)}
                      </ul>
                    ` : ``}


                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>
  `);
};

