const ZERO = 0;
const ONE = 1;
const RANDOM_NUMBER = 0.5;
const MAX_RATING = 9;
const YEAR_MIN = 1920;
const YEAR_MAX = 2020;
const MINUTE_MIN = 60;
const MINUTE_MAX = 140;
const COMMENT_MAX = 200;

const Feature = {
  comment: `comment`,
  rating: `rating`
};

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

export {ZERO, ONE, RANDOM_NUMBER, MAX_RATING, YEAR_MIN, YEAR_MAX, MINUTE_MIN, MINUTE_MAX, COMMENT_MAX, sentences, posters, films, genres, Feature};
