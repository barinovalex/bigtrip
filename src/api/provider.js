import {nanoid} from "nanoid";
import Events from "../model/events";

const getSyncedEvents = (items) => {
  const returnArray = items.filter(({success}) => success)
    .map(({payload}) => payload.point);
  return returnArray;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const createStoreStructureWithId = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [nanoid()]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, storeDestinations, storeOffers) {
    this._api = api;
    this._store = store;
    this._storeDestinations = storeDestinations;
    this._storeOffers = storeOffers;
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(Events.adaptToServer));
          this._store.setItems(items);
          return events;
        });
    }

    const eventsEvents = Object.values(this._store.getItems());

    return Promise.resolve(eventsEvents.map(Events.adaptEventToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructureWithId(destinations);
          this._storeDestinations.setItems(items);
          return destinations;
        });
    }

    const eventsDestinations = Object.values(this._storeDestinations.getItems());

    return Promise.resolve(eventsDestinations);
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructureWithId(offers);
          this._storeOffers.setItems(items);
          return offers;
        });
    }

    const eventsOffers = Object.values(this._storeOffers.getItems());

    return Promise.resolve(eventsOffers);
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setItem(updatedEvent.id, Events.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setItem(event.id, Events.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, Events.adaptToServer(newEvent));
          return newEvent;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._store.setItem(localNewEvent.id, Events.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    this._store.removeItem(event.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
