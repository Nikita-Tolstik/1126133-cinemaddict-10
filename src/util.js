import {ZERO, ONE, RANDOM_NUMBER} from './const.js';

const MINUTE = 60;

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + ONE - min));
};

const getRatingNumber = (min, max) => {
  return getRandomNumber(min, max) + Number(Math.random().toFixed(1));
};


const getDescription = (allSentences, max) => {
  return allSentences
    .filter(() => Math.random() > RANDOM_NUMBER)
    .slice(ZERO, getRandomNumber(ONE, max))
    .join(` `);
};

const getTimeFilm = (time) => {

  return time < MINUTE ? `${time}m` : `${Math.floor(time / MINUTE)}h ${time % MINUTE}m`;

};


export {getRandomNumber, getRatingNumber, getDescription, getTimeFilm};


