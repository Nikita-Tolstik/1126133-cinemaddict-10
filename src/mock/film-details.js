import {ZERO, ONE, MAX_RATING, YEAR_MIN, YEAR_MAX, MINUTE_MIN, MINUTE_MAX, COMMENT_MAX, sentences, posters, films, genres} from '../const.js';
import {getRandomNumber, getRatingNumber, getDescription, getTimeFilm} from '../util.js';

const SENTENCES_MAX = 7;
const DAY_MIN = 1;
const DAY_MAX = 31;


const ages = [
  `0`,
  `6`,
  `12`,
  `16`,
  `18`
];

const directors = [
  `David Lynch`,
  `Martin Scorsese`,
  `Joel and Ethan Coen`,
  `Steven Soderbergh`,
  `Terrence Malick`
];

const actors = [
  `Robert De Niro, Jack Nicholson, Marlon Brando, Denzel Washington`,
  `Clark Gable, Tom Hanks, Humphrey Bogart, Daniel Day-Lewis, Sidney Poitier`,
  `Gregory Peck, Leonardo DiCaprio, Spencer Tracy, Shah Rukh Khan, Cary Grant`,
  `Laurence Olivier, James Stewart, Steve McQueen, Bruce Lee, Henry Fonda, Morgan Freeman`
];

const writers = [
  `Quentin Tarantino, Terrence Malick, David Lynch`,
  `Christopher Nolan`,
  `Joel Coen, Steve McQueen, Bruce Lee`,
  `Michael Mann, Spencer Tracy`,
  `Frank Darabont, Steven Soderbergh, Leonardo DiCaprio`,
  `Sergio Leone`,
  `Damien Chazelle, Tom Hanks, Humphrey Bogart, Daniel Day-Lewis`
];

const countrys = [
  `USA`,
  `Spain`,
  `Georgia`,
  `Russia`,
  `Mexico`,
  `Germany`,
  `Sweden`
];

const monthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const generateDate = () => {

  return `${getRandomNumber(DAY_MIN, DAY_MAX)} ${monthNames[getRandomNumber(ZERO, monthNames.length - ONE)]} ${getRandomNumber(YEAR_MIN, YEAR_MAX)}`;

};


const generateFilmDetails = () => {

  const filmTitle = films[getRandomNumber(ZERO, films.length - ONE)];

  return {

    title: filmTitle,
    originalTitle: filmTitle,
    image: posters[getRandomNumber(ZERO, posters.length - ONE)],
    description: getDescription(sentences, SENTENCES_MAX),
    rating: getRatingNumber(ONE, MAX_RATING),
    time: getTimeFilm(getRandomNumber(MINUTE_MIN, MINUTE_MAX)),
    genre: genres[getRandomNumber(ZERO, genres.length)],
    comment: getRandomNumber(ZERO, COMMENT_MAX),
    age: ages[getRandomNumber(ZERO, ages.length - ONE)],
    actor: actors[getRandomNumber(ZERO, actors.length - ONE)],
    director: directors[getRandomNumber(ZERO, directors.length - ONE)],
    writer: writers[getRandomNumber(ZERO, writers.length - ONE)],
    country: countrys[getRandomNumber(ZERO, countrys.length - ONE)],
    dateFilm: generateDate()
  };
};


export {generateFilmDetails};
