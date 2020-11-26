import NoEvents from "../view/no-events";
import Sort from "../view/sort";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {updateItem} from "../utils/common";
import Menu from "../view/menu";
import Filters from "../view/filters";
import TripDays from "../view/trip-days";
import TripDay from "../view/trip-day";
import {SortType} from "../const";
import EventPresenter from "./event";

export default class TripPresenter {
  constructor(eventsContainer, eventsModel) {
    this._eventsContainer = eventsContainer;
    this._eventsModel = eventsModel;
    this._sortType = SortType.DEFAULT;
    this._eventsPresenters = {};
    this._daysComponents = [];

    this._noEventsComponent = new NoEvents();
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  _getEvents() {
    switch (this._sortType) {
      case SortType.TIME:
        return this._eventsModel.getEvents().sort((a, b) => (a.finishDate - a.startDate) - (b.finishDate - b.startDate));
      case SortType.PRICE:
        return this._eventsModel.getEvents().sort((a, b) => a.price - b.price);
      default:
        return this._eventsModel.getEvents().sort((a, b) => a.startDate - b.startDate);
    }
  }

  init() {
    const siteMenuElement = document.querySelector(`#js-trip-menu`);
    render(siteMenuElement, new Menu(), RenderPosition.AFTEREND);

    const siteFiltersElement = document.querySelector(`#js-trip-filter`);
    render(siteFiltersElement, new Filters(), RenderPosition.AFTEREND);

    if (this._getEvents().length < 1) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();

    this._tripDaysComponent = new TripDays().getElement();
    render(this._eventsContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _handleEventChange(updatedEvent) {
    // Здесь будем вызывать обновление модели
    this._eventsPresenters[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventsPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _clearEventsList() {
    Object
      .values(this._eventsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventsPresenters = {};

    this._daysComponents.forEach((it) => remove(it));
    this._daysComponents = [];
  }

  _handleSortTypeChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._replaceSort();
    this._clearEventsList();
    this._renderEventsList();
  }

  _replaceSort() {
    const newSortComponent = new Sort(this._sortType);
    replace(newSortComponent, this._sortComponent);
    this._sortComponent = newSortComponent;
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderSort() {
    this._sortComponent = new Sort(this._sortType);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoEvents() {
    render(this._eventsContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    let currentDay = 0;
    let dayEventsListElement;
    let dayCounter = 1;
    let defaultSortFlag = true;
    for (const event of this._getEvents()) {
      if (defaultSortFlag && (currentDay !== event.startDate.getDate())) {
        let tripDay;
        if (this._sortType === SortType.DEFAULT) {
          tripDay = new TripDay(dayCounter, event.startDate);
          this._daysComponents.push(tripDay);
        } else {
          tripDay = new TripDay();
          this._daysComponents.push(tripDay);
          defaultSortFlag = false;
        }
        render(this._tripDaysComponent, tripDay, RenderPosition.BEFOREEND);
        dayEventsListElement = tripDay.getEventsList();
        currentDay = event.startDate.getDate();
        dayCounter++;
      }
      this._eventsPresenters[event.id] = new EventPresenter(dayEventsListElement, this._handleEventChange, this._handleModeChange);
      this._eventsPresenters[event.id].init(event);
    }
  }
}
