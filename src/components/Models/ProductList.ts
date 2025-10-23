import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';

export class ProductList extends EventEmitter {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor() {
        super();
    }

    setProducts(products: IProduct[]): void {
        this.products = [...products];
        this.emit('productlist:changed');
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.emit('productlist:selected');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    clearSelectedProduct(): void {
        this.selectedProduct = null;
    }
}