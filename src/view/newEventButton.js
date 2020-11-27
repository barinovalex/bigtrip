import Abstract from "./abstract";

const createButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class NewEventButton extends Abstract {
  getTemplate() {
    return createButtonTemplate();
  }

  setDisable() {
    this.getElement().disabled = true;
  }

  removeDisable() {
    this.getElement().disabled = false;
  }
}
