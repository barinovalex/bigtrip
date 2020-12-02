export const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const EventType = {
  taxi: {iconURL: `img/icons/taxi.png`, action: `to`},
  bus: {iconURL: `img/icons/bus.png`, action: `to`},
  train: {iconURL: `img/icons/train.png`, action: `to`},
  ship: {iconURL: `img/icons/ship.png`, action: `to`},
  transport: {iconURL: `img/icons/transport.png`, action: `to`},
  drive: {iconURL: `img/icons/drive.png`, action: `to`},
  flight: {iconURL: `img/icons/flight.png`, action: `to`},
  checkin: {iconURL: `img/icons/check-in.png`, action: `in`},
  sightseeing: {iconURL: `img/icons/sightseeing.png`, action: `in`},
  restaurant: {iconURL: `img/icons/restaurant.png`, action: `in`},
};

