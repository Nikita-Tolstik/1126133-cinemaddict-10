import {ONE} from './const.js';

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + ONE - min));
};

export {getRandomNumber};
