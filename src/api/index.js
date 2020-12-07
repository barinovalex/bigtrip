import Events from "../model/events";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((events) => events.map(Events.adaptEventToClient));
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON);
  }

  updateEvent(tripEvent) {
    return this._load({
      url: `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(Events.adaptToServer(tripEvent)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(Events.adaptEventToClient);
  }

  addEvent(tripEvent) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(Events.adaptToServer(tripEvent)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(Events.adaptEventToClient);
  }

  deleteEvent(tripEvent) {
    return this._load({
      url: `points/${tripEvent.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
