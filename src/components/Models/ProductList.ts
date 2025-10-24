import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductList {
  protected products: IProduct[];
  protected detailedProduct: IProduct | null;

  constructor(protected events: IEvents, ProductList: IProduct[] = []) {
    this.products = ProductList;
    this.detailedProduct = null;
  }

  setProductList(ProductList: IProduct[]): void {
    this.products = ProductList;

    this.events.emit('catalog:updated', { products: this.products });
  }

  getProductList(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const foundProduct = this.products.find(product => product.id === id);

    if (foundProduct) {
      return foundProduct;
    } else {
      return undefined;
    }
  }

  setDetailedProduct(detailedProduct: IProduct): void {
    this.detailedProduct = detailedProduct;

    this.events.emit('catalog:detailedUpdated', { detailedProduct: this.detailedProduct })
  }

  getDetailedProduct(): IProduct | null {
    if (this.detailedProduct) {
      return this.detailedProduct;
    } else {
      return null;
    }
  }
}