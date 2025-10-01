import { IProduct } from '../../types/index';

export class Cart {
    private items: IProduct[] = [];

    constructor() {
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(item: IProduct): void {
        const index = this.items.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    clearCart(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    containsItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}