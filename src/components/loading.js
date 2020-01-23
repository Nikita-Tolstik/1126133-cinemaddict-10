import AbstractComponent from './abstract-component.js';

const createLoadingTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
   </section>`
;

export default class Loading extends AbstractComponent {

  getTemplate() {
    return createLoadingTemplate();
  }
}
