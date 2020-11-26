import Observer from "../utils/observer";

export default class Events extends Observer {
  constructor() {
    super();
    this._tripEvents = [];
  }

  setEvents(tripEvents) {
    this._tripEvents = tripEvents.slice();
  }

  getEvents() {
    return this._tripEvents;
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
}
