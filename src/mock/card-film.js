import {getRandomNumber, getRatingNumber, getDescription, getTimeFilm} from '../util.js';
import {ZERO, ONE, RANDOM_NUMBER, MAX_RATING, YEAR_MIN, YEAR_MAX, MINUTE_MIN, MINUTE_MAX, COMMENT_MAX, sentences, posters, films, genres} from '../const.js';

const SENTENCES_MAX = 3;

const generateFilmCard = () => ({

  filmInfo: {
    title: films[getRandomNumber(ZERO, films.length - ONE)],
    image: posters[getRandomNumber(ZERO, posters.length - ONE)],
    description: getDescription(sentences, SENTENCES_MAX),
    rating: getRatingNumber(ONE, MAX_RATING),
    year: getRandomNumber(YEAR_MIN, YEAR_MAX),
    time: getTimeFilm(getRandomNumber(MINUTE_MIN, MINUTE_MAX)),
    genre: genres[getRandomNumber(ZERO, genres.length)],
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
