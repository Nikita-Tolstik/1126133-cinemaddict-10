import {ZERO, ONE, SymbolName} from '../const.js';
import moment from 'moment';

const MINUTE = 60;
const MINUS_ONE = -1;
const DAYS = `days`;

const NumberRating = {
  ZERO: 0,
  ONE: 1,
  TEN: 10,
  ELEVEN: 11,
  TWENTY: 20
};

const ProfileLevel = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

const FormatDate = {
  REALESE: `DD MMMM YYYY`,
  COMMENT: `YYYY/MM/DD HH:MM`
};


export const getTimeFilm = (time) => {

  return time < MINUTE ? `${time}${SymbolName.MINUTE}` : `${Math.floor(time / MINUTE)}${SymbolName.HOUR} ${time % MINUTE}${SymbolName.MINUTE}`;

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

export const valuesComparator = (left, right) => {
  if (left > right) {
    return ONE;
  } else if (left < right) {
    return MINUS_ONE;
  } else {
    return ZERO;
  }
};

export const getRating = (number) => {
  let level;
  switch (true) {
    case (number === NumberRating.ZERO):
      level = ``;
      break;
    case (number >= NumberRating.ONE && number <= NumberRating.TEN):
      level = ProfileLevel.NOVICE;
      break;
    case (number >= NumberRating.ELEVEN && number <= NumberRating.TWENTY):
      level = ProfileLevel.FAN;
      break;
    default:
      level = ProfileLevel.MOVIE_BUFF;
  }
  return level;
};

export const getDifferenceDate = (date) => {

  const a = moment(new Date());
  const b = moment(date);

  return a.diff(b, DAYS, true);
};

