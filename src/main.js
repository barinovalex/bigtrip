import RouteInfo from './components/route-info.js';
import RouteCost from "./components/route-cost.js";
import Menu from './components/menu.js';
import Filters from './components/filters.js';
import Sort from './components/sort.js';
import TripDays from "./components/trip-days";
import EventForm from "./components/event-edit";
import TripEvent from "./components/event";
import TripDay from "./components/trip-day";

import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils";
import NoEvents from "./components/no-events";

const EVENT_COUNT = 24;

const events = new Array(EVENT_COUNT).fill(``).map(generateEvent).sort((a, b) => a.startDate - b.startDate);

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, new RouteInfo(events).getElement(), RenderPosition.AFTERBEGIN);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, new RouteCost(events).getElement(), RenderPosition.BEFOREEND);

const siteEventsElement = document.querySelector(`.trip-events`);
const siteMenuElement = document.querySelector(`#js-trip-menu`);
const siteFiltersElement = document.querySelector(`#js-trip-filter`);

render(siteMenuElement, new Menu().getElement(), RenderPosition.AFTEREND);
render(siteFiltersElement, new Filters().getElement(), RenderPosition.AFTEREND);

if (events.length < 1) {
  render(siteEventsElement, new NoEvents().getElement(), RenderPosition.BEFOREEND);
} else {

  render(siteEventsElement, new Sort().getElement(), RenderPosition.BEFOREEND);
  render(siteEventsElement, new EventForm().getElement(), RenderPosition.BEFOREEND);

  const renderEvent = (eventsListElement, event) => {
    const eventComponent = new TripEvent(event);
    const eventEditComponent = new EventForm(event);

    const replaceCardToForm = () => {
      eventsListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    };

    const replaceFormToCard = () => {
      eventsListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    };

    const onEditClose = (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      replaceCardToForm();
      eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onEditClose);
      eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, onEditClose);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
  };

  const siteDaysElement = new TripDays().getElement();
  render(siteEventsElement, siteDaysElement, RenderPosition.BEFOREEND);

  let currentDay = new Date(0).getDate();

  let siteEventsListElement;
  let dayCounter = 1;
  for (const event of events) {
    if (currentDay !== event.startDate.getDate()) {
      render(siteDaysElement, new TripDay(dayCounter, event.startDate).getElement(), RenderPosition.BEFOREEND);
      siteEventsListElement = siteDaysElement.querySelector(`.trip-days__item:last-child .trip-events__list`);
      currentDay = event.startDate.getDate();
      dayCounter++;
    }

    renderEvent(siteEventsListElement, event);
  }
}

