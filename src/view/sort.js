import Abstract from "./abstract";
import {SortType} from "../const";

const createSortTemplate = (sortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day">${sortType === SortType.DEFAULT ? `Day` : ``}</span>
            <div class="trip-sort__item  trip-sort__item--event">
              <input id="${SortType.DEFAULT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.DEFAULT}" ${sortType === SortType.DEFAULT ? `checked` : ``}>
              <label class="trip-sort__btn" for="${SortType.DEFAULT}">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="${SortType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.TIME}" ${sortType === SortType.TIME ? `checked` : ``}>
              <label class="trip-sort__btn" for="${SortType.TIME}">
                Time
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="${SortType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE}" ${sortType === SortType.PRICE ? `checked` : ``}>
              <label class="trip-sort__btn" for="${SortType.PRICE}">
                Price
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>

            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>`;
};

export default class Sort extends Abstract {
  constructor(sortType) {
    super();

    this._sortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.getAttribute(`for`));
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

