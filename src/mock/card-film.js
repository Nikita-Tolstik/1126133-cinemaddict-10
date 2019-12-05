import {getRandomNumber, getRatingNumber, getDescription, getRandomDate} from '../util.js';
import {ZERO, ONE, RANDOM_NUMBER, MAX_RATING, MINUTE_MIN, MINUTE_MAX, COMMENT_MAX, SENTENCES, POSTERS, FILMS, GENRES} from '../const.js';

const SENTENCES_MAX = 3;


const generateFilmCard = () => ({

  filmInfo: {
    title: FILMS[getRandomNumber(ZERO, FILMS.length - ONE)],
    image: POSTERS[getRandomNumber(ZERO, POSTERS.length - ONE)],
    description: getDescription(SENTENCES, SENTENCES_MAX),
    rating: getRatingNumber(ONE, MAX_RATING),
    date: getRandomDate(),
    time: getRandomNumber(MINUTE_MIN, MINUTE_MAX),
    genre: GENRES[getRandomNumber(ZERO, GENRES.length)],
    comment: getRandomNumber(ZERO, COMMENT_MAX)
  },

  userDetails: {
    isWathclist: Math.random() > RANDOM_NUMBER,
    isHistory: Math.random() > RANDOM_NUMBER,
    isFavorites: Math.random() > RANDOM_NUMBER
  }

});

const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};


export {generateFilmCard, generateFilmCards};
