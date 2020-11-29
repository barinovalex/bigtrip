import RouteInfo from './view/route-info.js';
import RouteCost from "./view/route-cost.js";

import {generateEvent} from "./mock/event.js";
import {render, RenderPosition, remove} from "./utils/render";
import TripPresenter from "./presenter/trip";
import Events from "./model/events";
import Menu from "./view/menu";
import {MenuItem} from "./const.js";
import Statistics from "./view/statistics";

const EVENT_COUNT = 24;
let statisticsComponent = null;

const events = new Array(EVENT_COUNT).fill(``).map(generateEvent).sort((a, b) => a.startDate - b.startDate);

const eventsModel = new Events();
eventsModel.setEvents(events);

const siteTripMainElement = document.querySelector(`.trip-main`);
render(siteTripMainElement, new RouteInfo(events), RenderPosition.AFTERBEGIN);

const siteTripInfoElement = document.querySelector(`.trip-info`);
render(siteTripInfoElement, new RouteCost(events), RenderPosition.BEFOREEND);

const siteEventsElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new Menu();
const siteMenuElement = document.querySelector(`#js-trip-menu`);
render(siteMenuElement, siteMenuComponent, RenderPosition.AFTEREND);

const eventsPresenter = new TripPresenter(siteEventsElement, eventsModel);

const handleSiteMenuClick = (menuItem) => {
  siteMenuComponent.setMenuItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      eventsPresenter.init();
      break;
    case MenuItem.STATS:
      eventsPresenter.destroy();
      statisticsComponent = new Statistics(eventsModel.getEvents());
      render(siteEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

eventsPresenter.init();


document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  eventsPresenter.createEvent();
});
