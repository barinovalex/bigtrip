import NoEvents from "../view/no-events";
import Sort from "../view/sort";
import {remove, render, RenderPosition, replace} from "../utils/render";
import Filters from "../view/filters";
import TripDays from "../view/trip-days";
import TripDay from "../view/trip-day";
import {FilterType, SortType, UpdateType, UserAction} from "../const";
import EventPresenter from "./event";
import {filter} from "../utils/common.js";

export default class TripPresenter {
  constructor(eventsContainer, eventsModel) {
    this._eventsContainer = eventsContainer;
    this._eventsModel = eventsModel;
    this._sortType = SortType.DEFAULT;
    this._filterType = FilterType.EVERYTHING;
    this._eventsPresenters = {};
    this._daysComponents = [];
    this._sortComponent = null;
    this._filtersComponent = null;

    this._noEventsComponent = new NoEvents();
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  _getEvents() {
    const filteredEvents = filter[this._filterType](this._eventsModel.getEvents());

    switch (this._sortType) {
      case SortType.TIME:
        return filteredEvents.sort((a, b) => (a.finishDate - a.startDate) - (b.finishDate - b.startDate));
      case SortType.PRICE:
        return filteredEvents.sort((a, b) => a.price - b.price);
      default:
        return filteredEvents.sort((a, b) => a.startDate - b.startDate);
    }
  }

  init() {
    const siteFiltersElement = document.querySelector(`#js-trip-filter`);
    this._filtersComponent = new Filters(`everything`);
    render(siteFiltersElement, this._filtersComponent, RenderPosition.AFTEREND);

    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (this._getEvents().length < 1) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();

    this._tripDaysComponent = new TripDays().getElement();
    render(this._eventsContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._eventsPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this._renderSort();
        this._renderEventsList();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList(true);
        this._renderSort();
        this._renderEventsList();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventsPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterType === filterType) {
      return;
    }
    this._filterType = filterType;
    this._handleModelEvent(`MAJOR`);
  }

  _clearEventsList(resetSortType = false) {
    Object
      .values(this._eventsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventsPresenters = {};

    this._daysComponents.forEach((it) => remove(it));
    this._daysComponents = [];

    if (resetSortType) {
      this._sortType = SortType.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._clearEventsList();
    this._renderSort();
    this._renderEventsList();
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new Sort(this._sortType);

    if (prevSortComponent === null) {
      render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    } else {
      replace(this._sortComponent, prevSortComponent);
      remove(prevSortComponent);
    }

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
      this._eventsPresenters[event.id] = new EventPresenter(dayEventsListElement, this._handleViewAction, this._handleModeChange);
      this._eventsPresenters[event.id].init(event);
    }
  }
}
