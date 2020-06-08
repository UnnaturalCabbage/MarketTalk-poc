export default function() {
  let { products } = this;

  return `
    <div class="products">
      ${products.reduce((final, {id, img, title, brand, price, currency, description}) => `${final}
        <div class="product card mb-3" data-on-click="openProduct(${id})">
          <div class="row no-gutters">
            <div class="col-md-4">
                <img src="${img}" class="card-img" alt="${title}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${brand} ${title}</h5>
                <p class="card-text">${price} ${currency}</p>
                <p class="card-text">${description.length > 75 ? description.slice(0, 100) + "..." : description}</p>
              </div>
            </div>
          </div>
        </div>
      `, "")}
    </div>
  `;
}