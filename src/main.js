import RouteInfo from './view/route-info.js';
import RouteCost from "./view/route-cost.js";

import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render";
import TripPresenter from "./presenter/trip";
import Events from "./model/events";

const EVENT_COUNT = 24;

const events = new Array(EVENT_COUNT).fill(``).map(generateEvent).sort((a, b) => a.startDate - b.startDate);

const eventsModel = new Events(events);

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, new RouteInfo(events), RenderPosition.AFTERBEGIN);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, new RouteCost(events), RenderPosition.BEFOREEND);

const siteEventsElement = document.querySelector(`.trip-events`);

const eventsPresenter = new TripPresenter(siteEventsElement, eventsModel);
eventsPresenter.init(events);
