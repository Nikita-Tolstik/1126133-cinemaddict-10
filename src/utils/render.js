export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`
};

// Отрисовка компонентов на страницу
export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTER:
      container.after(component.getElement());
      break;
  }
};

// Создание елемента из разметки
export const createElement = (template) => {

  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const removePopup = (component) => {
  const parentElement = component.getElement().parentElement;
  const popupElement = component.getElement();

  if (parentElement && popupElement) {
    parentElement.removeChild(popupElement);
  }

};
