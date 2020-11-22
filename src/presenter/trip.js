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
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._sortType = SortType.DEFAULT;
    this._eventsPresenters = {};
    this._daysComponents = [];

    this._noEventsComponent = new NoEvents();
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();
    const siteMenuElement = document.querySelector(`#js-trip-menu`);
    render(siteMenuElement, new Menu(), RenderPosition.AFTEREND);

    const siteFiltersElement = document.querySelector(`#js-trip-filter`);
    render(siteFiltersElement, new Filters(), RenderPosition.AFTEREND);

    if (this._events.length < 1) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    //    render(this._eventsContainer, new EventForm(), RenderPosition.BEFOREEND);

    this._tripDaysComponent = new TripDays().getElement();
    render(this._eventsContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedEvent);
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

    switch (sortType) {
      case SortType.TIME:
        this._events.sort((a, b) => (a.finishDate - a.startDate) - (b.finishDate - b.startDate));
        break;
      case SortType.PRICE:
        this._events.sort((a, b) => a.price - b.price);
        break;
      default:
        this._events = this._sourcedEvents.slice();
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
    let currentDay = new Date(0).getDate();
    let dayEventsListElement;
    let dayCounter = 1;
    let defaultSortFlag = true;
    for (const event of this._events) {
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
