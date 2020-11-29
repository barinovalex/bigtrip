import Abstract from "./abstract";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
              <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">${MenuItem.STATS}</a>
            </nav>`;
};

export default class Menu extends Abstract {
  constructor() {
    super();
    this._currentMenuItem = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (this._currentMenuItem === evt.target.dataset.menuItem) {
      return;
    }
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    Array.from(this.getElement().querySelectorAll(`.trip-tabs__btn`)).forEach((it) => {
      it.addEventListener(`click`, this._menuClickHandler);
    });
  }

  setMenuItem(menuItem) {
    this._currentMenuItem = menuItem;
    Array.from(this.getElement().querySelectorAll(`.trip-tabs__btn`)).forEach((it) => {
      it.classList.remove(`trip-tabs__btn--active`);
    });
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
