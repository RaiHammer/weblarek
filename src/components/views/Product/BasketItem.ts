import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';
import { ensureElement } from '../../../utils/utils';




interface BasketItemData extends IProduct {
    index: number;
}

export class BasketItem extends Product {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-basket');
        
        // Находим элементы по существующей разметке
        const templateElement = this.container.querySelector('.card') as HTMLElement;
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', templateElement);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', templateElement);
        
        this.attachEventListeners();
    }

    render(data: BasketItemData): HTMLElement {
        this.container.dataset.id = data.id;
        this.setTitle(data.title);
        this.setPrice(data.price);
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