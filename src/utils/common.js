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
  return date.toLocaleString(`ru`, {
    hour: `numeric`,
    minute: `numeric`,
  });
};

export const humanizeDateInput = (date) => {
  const formattedDate = date.toLocaleString(`en-GB`, {
    year: `2-digit`,
    month: `numeric`,
    day: `numeric`,
  });
  const formattedTime = date.toLocaleString(`ru`, {
    hour: `numeric`,
    minute: `numeric`,
  });
  return `${formattedDate} ${formattedTime}`;
};

export const humanizeDateSpread = (startDate, finishDate) => {
  finishDate.setSeconds(59);
  startDate.setSeconds(0);
  const spread = finishDate.getTime() - startDate.getTime();
  const spreadDay = Math.trunc(Math.abs(spread) / (1000 * 60 * 60 * 24));
  const spreadHours = Math.trunc(Math.abs(spread) / (1000 * 60 * 60)) - (spreadDay * 24);
  const spreadMinutes = Math.trunc(Math.abs(spread) / (1000 * 60)) - (spreadDay * 24 * 60) - (spreadHours * 60);
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
