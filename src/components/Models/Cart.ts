import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';

export class Cart extends EventEmitter {
    private items: IProduct[] = [];

    constructor() {
        super();
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        if (!this.containsItem(item.id)) {
            this.items.push(item);
            this.emit('cart:item-added', { item });
            this.emit('cart:changed', { items: this.getItems() });
            this.emit('cart:total-changed', { total: this.getTotalPrice() });
            this.emit('cart:count-changed', { count: this.getItemsCount() });
        }
    }

    removeItem(item: IProduct): void {
        const index = this.items.findIndex((cartItem) => cartItem.id === item.id);
        if (index !== -1) {
            const removedItem = this.items[index];
            this.items.splice(index, 1);
            this.emit('cart:item-removed', { item: removedItem });
            this.emit('cart:changed', { items: this.getItems() });
            this.emit('cart:total-changed', { total: this.getTotalPrice() });
            this.emit('cart:count-changed', { count: this.getItemsCount() });
        }
    }

    removeItemById(itemId: string): void {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            this.removeItem(item);
        }
    }

    clearCart(): void {
        this.items = [];
        this.emit('cart:cleared', {});
        this.emit('cart:changed', { items: this.getItems() });
        this.emit('cart:total-changed', { total: 0 });
        this.emit('cart:count-changed', { count: 0 });
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
        return this.items.some((item) => item.id === id);
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    getItemIds(): string[] {
        return this.items.map(item => item.id);
    }

    canCheckout(): boolean {
        return !this.isEmpty() && this.items.every(item => item.price !== null);
    }
}