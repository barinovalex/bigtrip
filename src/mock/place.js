import {getRandomInteger} from "../utils/common";

export const NAME_PLACES = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Moscow`,
  `New York`,
  `Los Angeles`,
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

export const generatePlace = () => {
  return (
    {
      name: NAME_PLACES[getRandomInteger(0, NAME_PLACES.length - 1)],
      description: new Array(getRandomInteger(0, 5)).fill().map(() => descriptions[getRandomInteger(0, descriptions.length - 1)]).join(` `),
      photos: new Array(getRandomInteger(0, 10)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`)
    }
  );
};
