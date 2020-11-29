import moment from "moment";
import {FilterType} from "../const";

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

export const humanizeDuration = (duration) => {
  const spreadDay = moment.duration(duration).get(`days`);
  const spreadHours = moment.duration(duration).get(`hours`);
  const spreadMinutes = moment.duration(duration).get(`minutes`);
  return `${spreadDay > 0 ? `${spreadDay}D ` : ``}${spreadHours > 0 ? `${spreadHours}H ` : ``}${spreadMinutes > 0 ? `${spreadMinutes}M ` : ``}`;
};

export const humanizeDateSpread = (startDate, finishDate) => {
  return humanizeDuration(finishDate - startDate);
};

export const isDatesEqual = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter((task) => task.finishDate > new Date()),
  [FilterType.PAST]: (events) => events.filter((task) => task.finishDate < new Date())
};
