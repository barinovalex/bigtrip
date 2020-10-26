import {createRouteInfoTemplate} from './components/route-info.js';
import {createRouteCostTemplate} from './components/route-cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createAddEventFormTemplate} from './components/event-form.js';
import {createTripDaysTemplate} from './components/trip-days.js';
import {createEventTemplate} from './components/event.js';

const EVENT_COUNT = 3;

const render = (container, layout, place) => {
  container.insertAdjacentHTML(place, layout);
};

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, createRouteInfoTemplate(), `afterbegin`);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, createRouteCostTemplate(), `beforeend`);

const siteMenuElement = document.querySelector(`#js-trip-menu`);
const siteFiltersElement = document.querySelector(`#js-trip-filter`);
const siteEventsElement = document.querySelector(`.trip-events`);

render(siteMenuElement, createMenuTemplate(), `afterend`);
render(siteFiltersElement, createFiltersTemplate(), `afterend`);
render(siteEventsElement, createSortTemplate(), `beforeend`);
render(siteEventsElement, createAddEventFormTemplate(), `beforeend`);
render(siteEventsElement, createTripDaysTemplate(), `beforeend`);

const siteEventsListElement = document.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(siteEventsListElement, createEventTemplate(), `beforeend`);
}
