import {getRandomNumber, getRatingNumber, getDescription, getRandomDate} from '../utils/common.js';
import {ZERO, ONE, RANDOM_NUMBER, MAX_RATING, MINUTE_MIN, MINUTE_MAX, SENTENCES, POSTERS, FILMS, GENRES} from '../const.js';

const SENTENCES_MAX = 3;
const NUMBER_DATE = 2999547470716;
const NUMBER_FOR_ID = 36;
const RANGE_NUMBER_MIN = 2;
const RANGE_NUMBER_MAX = 9;
const NUMBER_COMMENT_DATE_MAX = 100000000000;
const COMMENT_USER = 5;


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

const FACES = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`
];

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Very very interesting movie`,
  `I liked the actors and the genre of the film`,
  `Cool special effects and shooting`
];

const COMMENT_AUTHORS = [
  `Jeff Bridges`,
  `Sidney Poitier`,
  `Gene Hackman`,
  `Charles Chaplin`,
  `Ben Kingsley`,
  `Russell Crowe`,
  `Ralph Fiennes`
];

const generateComment = (idv, number) => {


  return new Array(number).fill(``).map(() => {

    const authorv = COMMENT_AUTHORS[getRandomNumber(ZERO, COMMENT_AUTHORS.length - ONE)];
    const commentv = COMMENTS[getRandomNumber(ZERO, COMMENTS.length - ONE)];
    const time = getRandomDate(NUMBER_COMMENT_DATE_MAX);
    const emoji = FACES[getRandomNumber(ZERO, FACES.length - ONE)];

    return {
      id: idv,
      author: authorv,
      comment: commentv,
      date: time,
      emotion: emoji
    };
  });


};

const getRandomGenres = (genres) => {

  let randomGenres = genres.filter(() => Math.random() > RANDOM_NUMBER);

  if (randomGenres.length === ZERO) {
    randomGenres = genres.filter(() => Math.random() > RANDOM_NUMBER);
  }

  return randomGenres;
};

export const generateFilmCard = () => {

  const filmTitle = FILMS[getRandomNumber(ZERO, FILMS.length - ONE)];
  const idMovie = (`_` + Math.random().toString(NUMBER_FOR_ID).substr(RANGE_NUMBER_MIN, RANGE_NUMBER_MAX));
  const commentUsersAll = generateComment(idMovie, getRandomNumber(ZERO, COMMENT_USER));

  return {
    filmInfo: {
      id: idMovie,
      title: filmTitle,
      originalTitle: filmTitle,
      image: POSTERS[getRandomNumber(ZERO, POSTERS.length - ONE)],
      description: getDescription(SENTENCES, SENTENCES_MAX),
      rating: getRatingNumber(ONE, MAX_RATING),
      date: getRandomDate(NUMBER_DATE),
      time: getRandomNumber(MINUTE_MIN, MINUTE_MAX),
      genres: getRandomGenres(GENRES),
      commentUsers: commentUsersAll,
      age: AGES[getRandomNumber(ZERO, AGES.length - ONE)],
      actor: ACTORS[getRandomNumber(ZERO, ACTORS.length - ONE)],
      director: DIRECTORS[getRandomNumber(ZERO, DIRECTORS.length - ONE)],
      writer: WRITERS[getRandomNumber(ZERO, WRITERS.length - ONE)],
      country: COUNTRYS[getRandomNumber(ZERO, COUNTRYS.length - ONE)],
    },

    userDetails: {
      isWatchlist: Math.random() > RANDOM_NUMBER,
      isWatched: Math.random() > RANDOM_NUMBER,
      isFavorite: Math.random() > RANDOM_NUMBER,
      watchedDate: new Date(getRandomDate(4000000000)).toISOString(),
    }
  };
};

export const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};
