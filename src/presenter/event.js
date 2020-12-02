import TripEvent from "../view/event";
import EventForm from "../view/event-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/common";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};


export default class EventPresenter {
  constructor(container, handleEventChange, changeMode, destinations, offers) {
    this._container = container;
    this._destinations = destinations;
    this._offers = offers;
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

    this._eventComponent = new TripEvent(tripEvent, this._offers);
    this._eventEditComponent = new EventForm(tripEvent, this._destinations, this._offers);

    this._eventComponent.setEditClickHandler(() => {
      this._replaceCardToForm();
    });

    this._eventEditComponent.setEditClickHandler(() => {
      this._replaceFormToCard();
    });

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEditComponent === null) {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };


    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
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
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }
}
