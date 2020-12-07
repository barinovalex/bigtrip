import TripPresenter from "./presenter/trip";
import Events from "./model/events";
import Menu from "./view/menu";
import Statistics from "./view/statistics";
import Api from "./api/index";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

import {render, RenderPosition, remove} from "./utils/render";
import {MenuItem, UpdateType} from "./const.js";

const siteEventsElement = document.querySelector(`.trip-events`);
const siteMenuElement = document.querySelector(`#js-trip-menu`);

const AUTHORIZATION = `Basic kdj5823kjhjhf74jlk8s`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_DESTINATIONS_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_OFFERS_PREFIX = `bigtrip-offers-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let statisticsComponent = null;
const eventsModel = new Events();
const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS_PREFIX, window.localStorage);
const storeOffers = new Store(STORE_OFFERS_PREFIX, window.localStorage);
const apiWithProvider = new Provider(api, store, storeDestinations, storeOffers);
const siteMenuComponent = new Menu();
const eventsPresenter = new TripPresenter(siteEventsElement, eventsModel, apiWithProvider);

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getOffers(), apiWithProvider.getEvents()])
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
