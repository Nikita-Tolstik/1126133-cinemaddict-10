import {ZERO, ONE, RANDOM_NUMBER, SymbolName} from '../const.js';
import moment from 'moment';

const MINUTE = 60;

const FormatDate = {
  REALESE: `DD MMMM YYYY`,
  COMMENT: `YYYY/MM/DD HH:MM`
};

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

  return time < MINUTE ? `${time + SymbolName.MINUTE}` : `${Math.floor(time / MINUTE) + SymbolName.HOUR} ${time % MINUTE + SymbolName.MINUTE}`;

};

export const getRandomDate = (number) => {

  const targetDate = new Date();
  const diffValue = getRandomNumber(ZERO, number);

  targetDate.setTime(targetDate.getTime() - diffValue);

  return targetDate.getTime();
};

export const formatReleaseDate = (date) => {

  return moment(date).format(FormatDate.REALESE);

};

export const formatCommentDate = (date) => {

  return moment(date).format(FormatDate.COMMENT);

};


export const getGeneralTimeMovies = (generalTime) => {

  const indexHour = generalTime.indexOf(SymbolName.HOUR);
  const indexMinute = generalTime.indexOf(SymbolName.MINUTE);

  const quantityHours = generalTime.slice(ZERO, indexHour);
  const quantityMinutes = generalTime.slice(indexHour + ONE, indexMinute);

  return {
    hours: quantityHours,
    minutes: quantityMinutes
  };
};

