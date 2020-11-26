import Observer from "../utils/observer";

export default class Events extends Observer {
  constructor(tripEvents) {
    super();
    this._tripEvents = tripEvents;
  }

  setEvents(tripEvents) {
    this._tripEvents = tripEvents.slice();
  }

  getEvents() {
    return this._tripEvents;
  }
}
