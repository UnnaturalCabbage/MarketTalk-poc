import { InputHandler } from "../../core";
import ProductsListGUI from "./products-list-gui";
import ProductsListVUI from "./products-list-vui";

@InputHandler({
  gui: ProductsListGUI,
  vui: ProductsListVUI,
  tag: "app-products-list"
})
export default class ProductsList extends HTMLElement {
  _products = [];

  constructor() {
    super();
  }

  get products() {
    return this._products;
  }

  set products(value) {
    this._products = value;
    this._render();
  }

  openProduct = (id) => {
    console.log(`openProduct(${id})`);
  };
}