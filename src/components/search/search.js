import { InputHandler } from "../../core";
import SearchGUI from "./search-gui";
import SearchVUI from "./search-vui";

import { ProductsService } from "../../services";

@InputHandler({
  gui: SearchGUI,
  vui: SearchVUI,
  tag: "app-search"
})
export default class Search extends HTMLElement {
  _productsService = new ProductsService();

  constructor() {
    super();
  }

  get productsService() {
    return this._productsService;
  }

  updateSearchInput = ({userInput}) => {
    console.log("updateSearchInput", userInput);
    this.querySelector(".search__input").value = userInput;
  }
  
  find = async ({userInput}) => {
    console.log("find", userInput);
    let result = await this.productsService.getProductByName(userInput)
    console.log("find", result);
  }
}