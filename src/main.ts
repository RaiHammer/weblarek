import "./scss/styles.scss";

import { ProductList } from "./components/Models/ProductList";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { ShopApi } from "./components/Api/ShopApi";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

const api = new Api(API_URL);

const shopApi = new ShopApi(api);

const productsModel = new ProductList();
const cartModel = new Cart();
const buyerModel = new Buyer();

console.log("=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===");

console.log("=== ТЕСТИРОВАНИЕ PRODUCTLIST ===");

productsModel.setProducts(apiProducts.items);

console.log("Массив товаров из каталога:", productsModel.getProducts());
console.log(
  "Количество товаров в каталоге:",
  productsModel.getProducts().length
);

const firstProduct = productsModel.getProducts()[0];
if (firstProduct) {
  const foundProduct = productsModel.getProductById(firstProduct.id);
  console.log("Найденный товар по ID:", foundProduct);

  productsModel.setSelectedProduct(firstProduct);
  console.log("Выбранный товар:", productsModel.getSelectedProduct());
}

console.log("\n=== ТЕСТИРОВАНИЕ CART ===");

if (productsModel.getProducts().length >= 2) {
  const product1 = productsModel.getProducts()[0];
  const product2 = productsModel.getProducts()[1];

  cartModel.addItem(product1);
  cartModel.addItem(product2);

  console.log("Товары в корзине:", cartModel.getItems());
  console.log("Количество товаров в корзине:", cartModel.getItemsCount());
  console.log("Общая стоимость корзины:", cartModel.getTotalPrice());
  console.log(
    "Проверка наличия товара 1:",
    cartModel.containsItem(product1.id)
  );

  cartModel.removeItem(product1);
  console.log("Товары в корзине после удаления:", cartModel.getItems());
  console.log("Количество товаров после удаления:", cartModel.getItemsCount());

  cartModel.clearCart();
  console.log("Корзина после очистки:", cartModel.getItems());
}

console.log("\n=== ТЕСТИРОВАНИЕ BUYER ===");

buyerModel.setData({
  payment: "online",
  email: "test@example.com",
  phone: "+79991234567",
  address: "Москва, ул. Примерная, д. 1",
});

console.log("Данные покупателя:", buyerModel.getData());

console.log("Валидация с полными данными:", buyerModel.validate());

buyerModel.setData({ email: "", phone: "" });
console.log("Валидация с неполными данными:", buyerModel.validate());

buyerModel.clearData();
console.log("Данные после очистки:", buyerModel.getData());

console.log("\n=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ЗАВЕРШЕНО ===");

console.log("\n=== ТЕСТИРОВАНИЕ РАБОТЫ С СЕРВЕРОМ ===");

async function testServerCommunication() {
  try {
    console.log("Получаем каталог товаров с сервера...");

    const products = await shopApi.getProductList();
    console.log("Полученные товары с сервера:", products);

    productsModel.setProducts(products);

    const savedProducts = productsModel.getProducts();
    console.log("Товары в модели после сохранения:", savedProducts);
    console.log("Количество товаров в каталоге:", savedProducts.length);

    if (savedProducts.length > 0) {
      const firstProduct = savedProducts[0];
      const foundProduct = productsModel.getProductById(firstProduct.id);
      console.log("Найденный товар по ID:", foundProduct);
    }

    console.log("Работа с сервером успешно протестирована!");
  } catch (error) {
    console.error("Ошибка при работе с сервером:", error);
  }
}

testServerCommunication();

async function testOrderSubmission() {
  try {
    console.log("\n=== ТЕСТ ДАННЫХ ЗАКАЗА ===");

    const testOrder = {
      payment: "online" as const,
      email: "test@example.com",
      phone: "+79991234567",
      address: "Москва, ул. Примерная, д. 1",
      total: 1000,
      items: ["item1", "item2"],
    };

    console.log("Тестовые данные заказа:", testOrder);
  } catch (error) {
    console.error("Ошибка при тестировании отправки заказа:", error);
  }
}

testOrderSubmission();
