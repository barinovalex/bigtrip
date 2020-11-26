import moment from "moment";

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const upCaseFirst = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

export const humanizeTime = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(`HH:mm`);
};

export const humanizeDateInput = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`dd/mm/YY HH:mm`);
};

export const humanizeDateSpread = (startDate, finishDate) => {
  const spread = finishDate - startDate;
  const spreadDay = moment.duration(spread).get(`days`);
  const spreadHours = moment.duration(spread).get(`hours`);
  const spreadMinutes = moment.duration(spread).get(`minutes`);
  return `${spreadDay > 0 ? `${spreadDay}D ` : ``}${spreadHours > 0 ? `${spreadHours}H ` : ``}${spreadMinutes > 0 ? `${spreadMinutes}M ` : ``}`;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
