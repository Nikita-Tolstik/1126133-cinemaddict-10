import {ZERO, ONE, RANDOM_NUMBER} from '../const.js';
import moment from 'moment';

const MINUTE = 60;


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

export const getRandomDate = (number) => {

  const targetDate = new Date();
  const diffValue = getRandomNumber(ZERO, number);

  targetDate.setTime(targetDate.getTime() - diffValue);

  return targetDate.getTime();
};

export const formatReleaseDate = (date) => {

  return moment(date).format(`DD MMMM YYYY`);

};

export const formatCommentDate = (date) => {

  return moment(date).format(`YYYY/MM/DD HH:MM`);

};
