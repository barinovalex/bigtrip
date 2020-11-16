import Abstract from "./abstract";

const createTripDaysTemplate = () => {
  return `<ul class="trip-days">
          </ul>`;
};

export default class TripDays extends Abstract {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
