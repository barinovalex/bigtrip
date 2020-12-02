import TripPresenter from "./presenter/trip";
import Events from "./model/events";
import Menu from "./view/menu";
import Statistics from "./view/statistics";
import Api from "./api";

import {render, RenderPosition, remove} from "./utils/render";
import {MenuItem, UpdateType} from "./const.js";


const siteEventsElement = document.querySelector(`.trip-events`);
const siteMenuElement = document.querySelector(`#js-trip-menu`);

const AUTHORIZATION = `Basic kdjf823kjhjhf74jlk8s`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
let statisticsComponent = null;

const eventsModel = new Events();
const api = new Api(END_POINT, AUTHORIZATION);
const siteMenuComponent = new Menu();
const eventsPresenter = new TripPresenter(siteEventsElement, eventsModel, api);

Promise.all([api.getDestinations(), api.getOffers(), api.getEvents()])
  .then(([destinations, offers, events]) => {
    eventsModel.setDestinations(Events.adaptDestinationsToClient(destinations));
    eventsModel.setOffers(Events.adaptOffersToClient(offers));
    eventsModel.setEvents(UpdateType.INIT, events);

    render(siteMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });

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
