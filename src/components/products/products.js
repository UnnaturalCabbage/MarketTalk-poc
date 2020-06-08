import { InputHandler, ViewModel } from "../../core";
import ProductsGUI from "./products-gui";
import ProductsVUI from "./products-vui";

import { ProductsService } from "../../services";

@InputHandler({
  gui: ProductsGUI,
  vui: ProductsVUI,
  tag: "app-products"
})
export default class Products extends ViewModel {
  productsService = new ProductsService();
  state = {
    products: [],
    filters: []
  };

  onConnectedCallback = () => {
    this.setMainProducts();
  }

  setMainProducts = async () => {
    this.querySelector(".search__input").value = "";
    this.setState({
      products: await this.productsService.getCategoryProducts("smartphones"),
      filters: Object.entries(await this.productsService.getCategoryFilters("smartphones"))
    });
  }

  openProduct = (id) => {
  };

  updateSearchInput = ({userInput}) => {
    this.querySelector(".search__input").value = userInput;
  }
  
  findProducts = async ({userInput}) => {
    this.setState({ products: await this.productsService.getProductsByName(userInput) });
  }

  filterProducts = ({userInput}) => {
    console.log(userInput);
  }
}