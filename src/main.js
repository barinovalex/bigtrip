import {createRouteInfoTemplate} from './components/route-info.js';
import {createRouteCostTemplate} from './components/route-cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createEditEventFormTemplate} from './components/event-edit.js';
import {createTripDayTemplate} from './components/trip-day.js';
import {createEventTemplate} from './components/event.js';
import {generateEvent} from "./mock/event";

const EVENT_COUNT = 24;

const render = (container, layout, place) => {
  container.insertAdjacentHTML(place, layout);
};

const events = new Array(EVENT_COUNT).fill(``).map(generateEvent).sort((a, b) => a.startDate - b.startDate);

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, createRouteInfoTemplate(events), `afterbegin`);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, createRouteCostTemplate(events), `beforeend`);

const siteMenuElement = document.querySelector(`#js-trip-menu`);
const siteFiltersElement = document.querySelector(`#js-trip-filter`);
const siteEventsElement = document.querySelector(`.trip-events`);

render(siteMenuElement, createMenuTemplate(), `afterend`);
render(siteFiltersElement, createFiltersTemplate(), `afterend`);
render(siteEventsElement, createSortTemplate(), `beforeend`);
const daysContainer = `
          <ul class="trip-days">
          </ul>
`;
render(siteEventsElement, daysContainer, `beforeend`);

const siteDaysElement = document.querySelector(`.trip-days`);

let currentDay = new Date(0).getDate();

let siteEventsListElement;
let dayCounter = 1;
let flag = true;
for (const event of events) {
  if (currentDay !== event.startDate.getDate()) {
    render(siteDaysElement, createTripDayTemplate(dayCounter, event.startDate), `beforeend`);
    siteEventsListElement = siteDaysElement.querySelector(`.trip-days__item:last-child .trip-events__list`);
    currentDay = event.startDate.getDate();
    dayCounter++;
  }
  if (flag) {
    render(siteEventsListElement, createEditEventFormTemplate(event), `beforeend`);
  } else {
    render(siteEventsListElement, createEventTemplate(event), `beforeend`);
    flag = false;
  }
}
