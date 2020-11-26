import {getRandomInteger, getRandomDate} from "../utils/common.js";
import {generatePlace} from "../mock/place.js";

export const eventTypes = [
  {name: `taxi`, iconURL: `img/icons/taxi.png`, action: `to`},
  {name: `bus`, iconURL: `img/icons/bus.png`, action: `to`},
  {name: `train`, iconURL: `img/icons/train.png`, action: `to`},
  {name: `ship`, iconURL: `img/icons/ship.png`, action: `to`},
  {name: `transport`, iconURL: `img/icons/transport.png`, action: `to`},
  {name: `drive`, iconURL: `img/icons/drive.png`, action: `to`},
  {name: `flight`, iconURL: `img/icons/flight.png`, action: `to`},
  {name: `check-in`, iconURL: `img/icons/check-in.png`, action: `in`},
  {name: `sightseeing`, iconURL: `img/icons/sightseeing.png`, action: `in`},
  {name: `restaurant`, iconURL: `img/icons/restaurant.png`, action: `in`},
];

const eventOffers = [
  {name: `luggage`, description: `Add luggage`, price: 30},
  {name: `comfort`, description: `Switch to comfort class`, price: 100},
  {name: `meal`, description: `Add meal`, price: 15},
  {name: `seats`, description: `Choose seats`, price: 5},
  {name: `train`, description: `Travel by train`, price: 40},
];

for (const eventType of eventTypes) {
  if (Math.random() > 0.5) {
    eventType.offers = eventOffers.filter(() => Math.random() > 0.5);
  }
}

const getEventOffers = () => {
  let offers = [];
  if (Math.random() > 0.5) {
    offers = eventOffers.filter(() => Math.random() > 0.5);
  }
  return offers;
};

const getEventType = () => {
  return eventTypes[getRandomInteger(0, eventTypes.length - 1)];
};

eventTypes.map((it) => {
  it.offers = getEventOffers();
  return it;
});

const getCheckedOffers = (offers) => {
  const checkedOffers = {};
  offers.forEach((it) => {
    checkedOffers[it.name] = Math.random() > 0.5;
  });
  return checkedOffers;
};

export const generateEvent = () => {
  const eventType = getEventType();
  const checkedOffers = getCheckedOffers(eventType.offers);
  const today = new Date();
  const deadline = new Date();
  deadline.setDate(today.getDate() + 7);
  const startDate = getRandomDate(today, deadline);
  const finishDate = getRandomDate(startDate, deadline);
  return (
    {
      id: Date.now() + parseInt(Math.random() * 10000, 10),
      eventType,
      checkedOffers,
      place: generatePlace(),
      startDate,
      finishDate,
      price: getRandomInteger(10, 100) * 10,
      isFavorite: Math.random() > 0.5,
    }
  );
};
