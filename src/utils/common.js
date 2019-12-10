import {ZERO, ONE, RANDOM_NUMBER} from '../const.js';


const MINUTE = 60;
const NUMBER_TIME = 2999547470716;

export const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + ONE - min));
};

export const getRatingNumber = (min, max) => {
  return getRandomNumber(min, max) + Number(Math.random().toFixed(1));
};

export const getDescription = (allSentences, max) => {
  return allSentences
    .filter(() => Math.random() > RANDOM_NUMBER)
    .slice(ZERO, getRandomNumber(ONE, max))
    .join(` `);
};

export const getTimeFilm = (time) => {

  return time < MINUTE ? `${time}m` : `${Math.floor(time / MINUTE)}h ${time % MINUTE}m`;

};

export const getRandomDate = () => {

  const targetDate = new Date();
  const diffValue = getRandomNumber(ZERO, NUMBER_TIME);

  targetDate.setTime(targetDate.getTime() - diffValue);

  return targetDate.getTime();
};
