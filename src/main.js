import RouteInfo from './view/route-info.js';
import RouteCost from "./view/route-cost.js";
import Menu from './view/menu.js';
import Filters from './view/filters.js';
import Sort from './view/sort.js';
import TripDays from "./view/trip-days";
import EventForm from "./view/event-edit";
import TripEvent from "./view/event";
import TripDay from "./view/trip-day";

import {generateEvent} from "./mock/event.js";
import NoEvents from "./view/no-events";
import {render, RenderPosition, replace} from "./utils/render";

const EVENT_COUNT = 24;

const events = new Array(EVENT_COUNT).fill(``).map(generateEvent).sort((a, b) => a.startDate - b.startDate);

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, new RouteInfo(events), RenderPosition.AFTERBEGIN);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, new RouteCost(events), RenderPosition.BEFOREEND);

const siteEventsElement = document.querySelector(`.trip-events`);
const siteMenuElement = document.querySelector(`#js-trip-menu`);
const siteFiltersElement = document.querySelector(`#js-trip-filter`);

render(siteMenuElement, new Menu(), RenderPosition.AFTEREND);
render(siteFiltersElement, new Filters(), RenderPosition.AFTEREND);

if (events.length < 1) {
  render(siteEventsElement, new NoEvents(), RenderPosition.BEFOREEND);
} else {

  render(siteEventsElement, new Sort(), RenderPosition.BEFOREEND);
  render(siteEventsElement, new EventForm(), RenderPosition.BEFOREEND);

  const renderEvent = (eventsListElement, event) => {
    const eventComponent = new TripEvent(event);
    const eventEditComponent = new EventForm(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replace(eventEditComponent, eventComponent);
      eventEditComponent.setEditClickHandler(() => {
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
      eventEditComponent.setFormSubmitHandler(() => {
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
  };

  const siteDaysElement = new TripDays().getElement();
  render(siteEventsElement, siteDaysElement, RenderPosition.BEFOREEND);

  let currentDay = new Date(0).getDate();

  let dayEventsListElement;
  let dayCounter = 1;
  for (const event of events) {
    if (currentDay !== event.startDate.getDate()) {
      const tripDay = new TripDay(dayCounter, event.startDate);
      render(siteDaysElement, tripDay, RenderPosition.BEFOREEND);
      dayEventsListElement = tripDay.getEventsList();
      currentDay = event.startDate.getDate();
      dayCounter++;
    }

    renderEvent(dayEventsListElement, event);
  }
}

