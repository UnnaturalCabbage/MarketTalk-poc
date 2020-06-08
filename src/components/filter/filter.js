import { InputHandler } from "../../core";
import FitlerGUI from "./filter-gui";
import FilterVUI from "./filter-vui";

@InputHandler({
  gui: FitlerGUI,
  vui: FilterVUI,
  tag: "app-filter"
})
export default class Filter extends HTMLElement {
  _filters = {}

  openFilter = (e) => {
    console.log(e);
  };

  get filters() {
    return this._filters;
  }

  set filters(value) {
    this._filters = value;
    this._render();
  }
}