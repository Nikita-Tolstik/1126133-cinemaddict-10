import {getRandomNumber, getRatingNumber, getDescription, getRandomDate} from '../utils/common.js';
import {ZERO, ONE, RANDOM_NUMBER, MAX_RATING, MINUTE_MIN, MINUTE_MAX, COMMENT_MAX, SENTENCES, POSTERS, FILMS, GENRES} from '../const.js';

const SENTENCES_MAX = 3;
const NUMBER_TIME = 2999547470716;
const NUMBER_FOR_ID = 36;
const RANGE_NUMBER_MIN = 2;
const RANGE_NUMBER_MAX = 9;


const AGES = [
  `0`,
  `6`,
  `12`,
  `16`,
  `18`
];

const ACTORS = [
  `Robert De Niro, Jack Nicholson, Marlon Brando, Denzel Washington`,
  `Clark Gable, Tom Hanks, Humphrey Bogart, Daniel Day-Lewis, Sidney Poitier`,
  `Gregory Peck, Leonardo DiCaprio, Spencer Tracy, Shah Rukh Khan, Cary Grant`,
  `Laurence Olivier, James Stewart, Steve McQueen, Bruce Lee, Henry Fonda, Morgan Freeman`
];

const DIRECTORS = [
  `David Lynch`,
  `Martin Scorsese`,
  `Joel and Ethan Coen`,
  `Steven Soderbergh`,
  `Terrence Malick`
];

const WRITERS = [
  `Quentin Tarantino, Terrence Malick, David Lynch`,
  `Christopher Nolan`,
  `Joel Coen, Steve McQueen, Bruce Lee`,
  `Michael Mann, Spencer Tracy`,
  `Frank Darabont, Steven Soderbergh, Leonardo DiCaprio`,
  `Sergio Leone`,
  `Damien Chazelle, Tom Hanks, Humphrey Bogart, Daniel Day-Lewis`
];

const COUNTRYS = [
  `USA`,
  `Spain`,
  `Georgia`,
  `Russia`,
  `Mexico`,
  `Germany`,
  `Sweden`
];

const getRandomGenres = (genres) => {

  const randomGenres = genres.filter(() => Math.random() > RANDOM_NUMBER);

  return randomGenres;
};

export const generateFilmCard = () => {

  const filmTitle = FILMS[getRandomNumber(ZERO, FILMS.length - ONE)];


  return {
    filmInfo: {
      id: (`_` + Math.random().toString(NUMBER_FOR_ID).substr(RANGE_NUMBER_MIN, RANGE_NUMBER_MAX)),
      title: filmTitle,
      originalTitle: filmTitle,
      image: POSTERS[getRandomNumber(ZERO, POSTERS.length - ONE)],
      description: getDescription(SENTENCES, SENTENCES_MAX),
      rating: getRatingNumber(ONE, MAX_RATING),
      date: getRandomDate(NUMBER_TIME),
      time: getRandomNumber(MINUTE_MIN, MINUTE_MAX),
      genres: getRandomGenres(GENRES),
      comment: getRandomNumber(ZERO, COMMENT_MAX),
      age: AGES[getRandomNumber(ZERO, AGES.length - ONE)],
      actor: ACTORS[getRandomNumber(ZERO, ACTORS.length - ONE)],
      director: DIRECTORS[getRandomNumber(ZERO, DIRECTORS.length - ONE)],
      writer: WRITERS[getRandomNumber(ZERO, WRITERS.length - ONE)],
      country: COUNTRYS[getRandomNumber(ZERO, COUNTRYS.length - ONE)],
    },

    userDetails: {
      isWatchlist: Math.random() > RANDOM_NUMBER,
      isWatched: Math.random() > RANDOM_NUMBER,
      isFavorite: Math.random() > RANDOM_NUMBER
    }
  };
};

export const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};


