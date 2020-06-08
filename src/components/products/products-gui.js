export default function() {
  return `
    <div class="row">
      <div class="col-3">
        <app-filter data-bind="filters:filters"></app-filter>
      </div>
      <div class="col-8">
        <div class="search mb-3">
        <form class="form-inline">
          <input class="search__input form-control mr-sm-2" type="search" placeholder="..." aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Поиск</button>
        </form>
        </div>
        <app-products-list data-bind="products:products"></app-products-list>
      </div>
    </div>
  `;
}