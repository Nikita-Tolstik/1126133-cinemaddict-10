import AbstractComponent from './abstract-component.js';

const createNoMoviesTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`;

export default class NoMovies extends AbstractComponent {

  getTemplate() {
    return createNoMoviesTemplate();
  }
}
