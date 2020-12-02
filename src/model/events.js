import Observer from "../utils/observer";

export default class Events extends Observer {
  constructor() {
    super();
    this._tripEvents = [];
  }

  setEvents(updateType, tripEvents) {
    this._tripEvents = tripEvents.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._tripEvents;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  updateEvent(updateType, update) {
    const index = this._tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      update,
      ...this._tripEvents.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    update.newEvent = false;
    this._tripEvents = [
      update,
      ...this._tripEvents
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._tripEvents.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      ...this._tripEvents.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptDestinationsToClient(destinations) {
    const adaptedEvent = {};
    destinations.forEach((it) => {
      adaptedEvent[it.name] = it;
    });

    return adaptedEvent;
  }

  static adaptOffersToClient(offers) {
    const adaptedEvent = {};
    offers.forEach((it) => {
      adaptedEvent[it.type] = it;
      adaptedEvent[it.type][`action`] = (
        it.type === `check-in`
        || it.type === `sightseeing`
        || it.type === `restaurant`
          ? `in` : `to`);
    });
    return adaptedEvent;
  }

  static adaptEventToClient(tripEvent) {
    const adaptedEvent = Object.assign(
        {},
        tripEvent,
        {
          price: tripEvent.base_price,
          finishDate: new Date(tripEvent.date_to),
          startDate: new Date(tripEvent.date_from),
          place: tripEvent.destination,
          isFavorite: tripEvent.is_favorite,
          eventType: tripEvent.type
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.destination;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.type;

    return adaptedEvent;
  }

  static adaptToServer(tripEvent) {
    const adaptedEvent = Object.assign(
        {},
        tripEvent,
        {
          "date_from": tripEvent.startDate instanceof Date ? tripEvent.startDate.toISOString() : null,
          "date_to": tripEvent.finishDate instanceof Date ? tripEvent.finishDate.toISOString() : null,
          "is_favorite": tripEvent.isFavorite,
          "destination": tripEvent.place,
          "type": tripEvent.eventType,
          "base_price": Number(tripEvent.price),
        }
    );

    delete adaptedEvent.newEvent;
    delete adaptedEvent.startDate;
    delete adaptedEvent.finishDate;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.place;
    delete adaptedEvent.eventType;
    delete adaptedEvent.price;
    return adaptedEvent;
  }
}
