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
        this.emit('productlist:changed', this.getProducts());
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.emit('productlist:selected', product);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    clearSelectedProduct(): void {
        this.selectedProduct = null;
        this.emit('productlist:selected-cleared');
    }

    getAvailableProducts(): IProduct[] {
        return this.products.filter(product => product.price !== null);
    }

    getProductsByCategory(category: string): IProduct[] {
        return this.products.filter(product => product.category === category);
    }
}