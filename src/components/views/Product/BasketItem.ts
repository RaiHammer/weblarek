import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';

interface BasketItemData extends IProduct {
    index: number;
}

export class BasketItem extends Product {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-basket');
        
        this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
        this.attachEventListeners();
    }

    render(data: BasketItemData): HTMLElement {
        // Сохраняем ID товара в dataset для событий
        this.container.dataset.id = data.id;
        
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.setProductImage(data.image, data.title);
        this.setIndex(data.index);
        
        return this.container;
    }

    private setIndex(index: number): void {
        if (this.indexElement) {
            this.indexElement.textContent = String(index);
        }
    }

    private attachEventListeners(): void {
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.events.emit('basket:remove', { id: this.container.dataset.id });
            });
        }
    }
}