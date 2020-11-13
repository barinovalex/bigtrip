import NoEvents from "../view/no-events";
import Sort from "../view/sort";
import {render, RenderPosition, replace} from "../utils/render";
import Menu from "../view/menu";
import Filters from "../view/filters";
import EventForm from "../view/event-edit";
import TripEvent from "../view/event";
import TripDays from "../view/trip-days";
import TripDay from "../view/trip-day";
import {SortType} from "../const";

export default class EventsPresenter {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._sortType = SortType.DEFAULT;

    this._noEventsComponent = new NoEvents();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();
    const siteMenuElement = document.querySelector(`#js-trip-menu`);
    render(siteMenuElement, new Menu(), RenderPosition.AFTEREND);

    const siteFiltersElement = document.querySelector(`#js-trip-filter`);
    render(siteFiltersElement, new Filters(), RenderPosition.AFTEREND);

    this._renderEventsList();
  }

  _clearEventsList() {
    this._eventsContainer.innerHTML = ``;
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

    this._clearEventsList();
    this._renderEventsList();
  }

  _renderSort() {
    this._sortComponent = new Sort(this._sortType);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(eventsListElement, event) {
    const eventComponent = new TripEvent(event);
    const eventEditComponent = new EventForm(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replace(eventEditComponent, eventComponent);
      eventEditComponent.setEditClickHandler(() => {
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
      eventEditComponent.setFormSubmitHandler(() => {
        replace(eventComponent, eventEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._eventsContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    if (this._events.length < 1) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    render(this._eventsContainer, new EventForm(), RenderPosition.BEFOREEND);

    const siteDaysElement = new TripDays().getElement();
    render(this._eventsContainer, siteDaysElement, RenderPosition.BEFOREEND);

    let currentDay = new Date(0).getDate();

    let dayEventsListElement;
    let dayCounter = 1;
    let defaultSortFlag = true;
    for (const event of this._events) {
      if (defaultSortFlag && (currentDay !== event.startDate.getDate())) {
        let tripDay;
        if (this._sortType === SortType.DEFAULT) {
          tripDay = new TripDay(dayCounter, event.startDate);
        } else {
          tripDay = new TripDay();
          defaultSortFlag = false;
        }
        render(siteDaysElement, tripDay, RenderPosition.BEFOREEND);
        dayEventsListElement = tripDay.getEventsList();
        currentDay = event.startDate.getDate();
        dayCounter++;
      }

      this._renderEvent(dayEventsListElement, event);
    }
  }
}
