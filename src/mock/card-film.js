import {getRandomNumber} from '../util.js';
import {ZERO, ONE, RANDOM_NUMBER} from '../const.js';


const films = [
  `Joker`,
  `Avengers: Endgame`,
  `Knives Out`,
  `Ford v. Ferrari`,
  `Doctor Sleep`,
  `Zombieland: Double Tap`,
  `Once Upon A Time In Hollywood`,
  `Spider-Man: Far From Home`,
  `John Wick: Chapter 3`,
  `Shazam`,
  `21 Bridges`,
  `Harry Potter`,
  `Green Book`,
  `Mission: Impossible - Fallout`,
  `Ready Player One`
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const sentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];


const genres = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Biography`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Family`,
  `Fantasy`,
  `Western`,
  `Thriller`
];


const MAX_RATING = 9;
const SENTENCES_MAX = 3;
const YEAR_MIN = 1920;
const YEAR_MAX = 2020;
const MINUTE_MIN = 60;
const MINUTE_MAX = 140;
const COMMENT_MAX = 200;


const getRatingNumber = (min, max) => {
  return getRandomNumber(min, max) + Number(Math.random().toFixed(1));
};


const getDescription = (allSentences) => {
  return allSentences
    .filter(() => Math.random() > RANDOM_NUMBER)
    .slice(ZERO, getRandomNumber(ONE, SENTENCES_MAX))
    .join(` `);
};


const generateFilmCard = () => ({
  title: films[getRandomNumber(ZERO, films.length - ONE)],
  image: posters[getRandomNumber(ZERO, posters.length - ONE)],
  description: getDescription(sentences),
  rating: getRatingNumber(ONE, MAX_RATING),
  year: getRandomNumber(YEAR_MIN, YEAR_MAX),
  time: getRandomNumber(MINUTE_MIN, MINUTE_MAX),
  genre: genres[getRandomNumber(ZERO, genres.length)],
  comment: getRandomNumber(ZERO, COMMENT_MAX)

});

const generateFilmCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};


export {generateFilmCard, generateFilmCards};
