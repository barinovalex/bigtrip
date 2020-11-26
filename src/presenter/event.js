import TripEvent from "../view/event";
import EventForm from "../view/event-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/common";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};


export default class EventPresenter {
  constructor(container, handleEventChange, changeMode) {
    this._container = container;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._changeData = handleEventChange.bind(this);
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }
  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }
  _toggleFavorite() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._tripEvent,
            {
              isFavorite: !this._tripEvent.isFavorite
            }
        )
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset();
      this._replaceFormToCard();
    }
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevEventComponent = this._eventComponent;
    const prevEditComponent = this._eventEditComponent;

    this._eventComponent = new TripEvent(tripEvent);
    this._eventEditComponent = new EventForm(tripEvent);

    this._eventComponent.setEditClickHandler(() => {
      this._replaceCardToForm();
    });

    this._eventEditComponent.setEditClickHandler(() => {
      this._replaceFormToCard();
    });

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setFavoriteClickHandler(() => {
      this._toggleFavorite();
    });

    if (prevEventComponent === null || prevEditComponent === null) {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !isDatesEqual(this._tripEvent.startDate, update.startDate) ||
      !isDatesEqual(this._tripEvent.finishDate, update.finishDate) ||
      (this._tripEvent.price !== update.price);

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );
    this._replaceFormToCard();
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
    this._replaceFormToCard();
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }
}
