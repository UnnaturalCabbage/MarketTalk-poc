import { getSentensesEquality } from '../core/utils';

let db = {
  categories: {
    "smartphones": {
      id: "smartphones",
      filters: {
        color: {
          name: "цвет",
          options: ["белый", "черный"]
        }
      }
    }
  },
  products: {
    "0": {
      id: "0",
      categoryId: "smartphones",
      title: "iPhone SE 2020",
      description: "Apple iPhone SE - продолжение линейки компактных смартфонов. Как и iPhone 5S, корпус модели SE выполнен в аналогичном дизайне и габаритах, а также материалах. Размер и тип дисплея остался неизменным - это IPS матрица с диагональю 4 дюйма и плотностью точек 326 пикселов на дюйм.",
      brand: "Apple",
      price: "16999",
      discount: "13",
      currency: "UAH",
      img: "https://i.citrus.ua/imgcache/size_180/uploads/shop/e/5/e5e54fb94120a0e5f5084440c08fbd8a.jpg",
      filter: {
        color: "белый"
      }
    },
    "1": {
      id: "1",
      categoryId: "smartphones",
      title: "iPhone Xr",
      description: "Дисплей от края до края. Самый мощный аккумулятор среди всех iPhone. Максимальная производительность. Защита от брызг и воды. Фото студийного качества и видео 4K. Ещё надёжнее с Face ID. Новый iPhone XR. Великолепное обновление",
      brand: "Apple",
      price: "22999",
      discount: "13",
      currency: "UAH",
      img: "https://i.citrus.ua/imgcache/size_180/uploads/shop/5/5/5533198c217ea9a4280fdf804df8f088.jpg"
    },
    "2": {
      id: "2",
      categoryId: "smartphones",
      title: "iPhone Xs",
      description: "Дисплей Super Retina в двух размерах, один из которых стал самым большим в истории iPhone. Ещё более быстрый Face ID. Самый мощный и умный процессор iPhone. И потрясающая двойная камера с функцией «Глубина». В iPhone XS воплощено всё, что вы любите в iPhone. На новом уровне",
      brand: "Apple",
      price: "24999",
      discount: "13",
      currency: "UAH",
      img: "https://i.citrus.ua/imgcache/size_180/uploads/shop/3/c/3ca7aabff2212d386690746e4f259df9.jpg"
    }
  }
}

export default class ProductsService {
  getCategoryProducts(category) {
    return new Promise((res) => {
      let result = Object.values(db.products).filter(({categoryId}) => category === categoryId);;
      res(result);
    });
  }

  getCategoryFilters(category) {
    return new Promise((res) => {
      let result = db.categories[category].filters;
      res(result);
    });
  }

  getProductsByName(productName) {
    return new Promise((res) => {
      let result = Object.values(db.products)
        .reduce((currProducts, product) => {
          let equility = getSentensesEquality(productName, product.title);
          if (equility > 0.8) {
            currProducts.push([equility, product]);
          }
          return currProducts;
        }, [])
        .sort((a, b) => {
          return b[0] - a[0];
        });
      res(result.map(([_, p]) => p));
    });
  }
};