import NoEvents from "../view/no-events";
import Sort from "../view/sort";
import {remove, render, RenderPosition, replace} from "../utils/render";
import Filters from "../view/filters";
import TripDays from "../view/trip-days";
import TripDay from "../view/trip-day";
import {FilterType, SortType, UpdateType, UserAction} from "../const";
import EventPresenter, {State as EventPresenterViewState} from "./event";
import {filter} from "../utils/common.js";
import EventNew from "./event-new";
import NewEventButton from "../view/newEventButton";
import Loading from "../view/loading.js";
import RouteInfo from "../view/route-info";
import RouteCost from "../view/route-cost";

export default class TripPresenter {
  constructor(eventsContainer, eventsModel, api) {
    this._eventsContainer = eventsContainer;
    this._eventsModel = eventsModel;
    this._api = api;
    this._sortType = SortType.DEFAULT;
    this._filterType = FilterType.EVERYTHING;
    this._eventsPresenters = {};
    this._daysComponents = [];
    this._sortComponent = null;
    this._routeInfoComponent = null;
    this._routeCostComponent = null;
    this._filtersComponent = null;
    this._newEventButton = null;
    this._isLoading = true;

    this._noEventsComponent = new NoEvents();
    this._loadingComponent = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
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
    this._eventsModel.addObserver(this._handleModelEvent);
    const siteTripMainElement = document.querySelector(`.trip-main`);

    if (this._newEventButton === null) {
      this._newEventButton = new NewEventButton();
      render(siteTripMainElement, this._newEventButton, RenderPosition.BEFOREEND);
    }


    const siteFiltersElement = document.querySelector(`#js-trip-filter`);
    this._filtersComponent = new Filters(`everything`);
    render(siteFiltersElement, this._filtersComponent, RenderPosition.AFTEREND);

    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    this._renderTrip();
  }

  _renderTripSummary() {
    const prevRouteInfoComponent = this._routeInfoComponent;
    this._routeInfoComponent = new RouteInfo(this._eventsModel.getEvents());
    this._routeCostComponent = new RouteCost(this._eventsModel.getEvents());

    const siteTripMainElement = document.querySelector(`.trip-main`);

    if (prevRouteInfoComponent === null) {
      render(siteTripMainElement, this._routeInfoComponent, RenderPosition.AFTERBEGIN);
    } else {
      replace(this._routeInfoComponent, prevRouteInfoComponent);
      remove(prevRouteInfoComponent);
    }

    render(this._routeInfoComponent, this._routeCostComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length < 1) {
      this._renderNoEvents();
      return;
    }

    this._renderTripSummary();

    this._destination = this._eventsModel.getDestinations();
    this._offers = this._eventsModel.getOffers();
    this._eventNewPresenter = new EventNew(this._eventsContainer, this._handleViewAction, this._newEventButton, this._destination, this._offers);
    this._renderSort();

    this._tripDaysComponent = new TripDays();
    render(this._eventsContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  destroy() {
    this._clearEventsList({resetSortType: true});

    remove(this._tripDaysComponent);
    remove(this._filtersComponent);
    remove(this._sortComponent);
    this._sortComponent = null;

    this._eventsModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._sortType = SortType.DEFAULT;
    this._filterType = FilterType.EVERYTHING;
    this._handleModeChange();
    this._eventNewPresenter.init();
    this._newEventButton.setDisable();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsPresenters[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventsPresenters[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventsPresenters[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventsPresenters[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventsPresenters[data.id].init(data);
        this._renderTripSummary();
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this._renderTripSummary();
        this._renderSort();
        this._renderEventsList();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList(true);
        this._renderTripSummary();
        this._renderSort();
        this._renderEventsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
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
    this._eventNewPresenter.destroy();
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

  _renderLoading() {
    render(this._eventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
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
      this._eventsPresenters[event.id] = new EventPresenter(dayEventsListElement, this._handleViewAction, this._handleModeChange, this._destination, this._offers);
      this._eventsPresenters[event.id].init(event);
    }
  }
}
