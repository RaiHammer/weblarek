import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';

interface ProductCardData extends IProduct {
    buttonText?: string;
    buttonDisabled?: boolean;
}

export class ProductCard extends Product {
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-catalog');
        
        this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement;
        this.attachEventListeners();
    }

    render(data: ProductCardData): HTMLElement {
        this.container.dataset.id = data.id;
        
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.setProductImage(data.image, data.title);
        this.setCategory(data.category);
        
        if (this.buttonElement) {
            this.buttonElement.textContent = data.buttonText || 'В корзину';
            this.buttonElement.disabled = data.buttonDisabled || false;
        }
        
        return this.container;
    }

    private attachEventListeners(): void {
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });

        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.emit('card:add-to-cart', { id: this.container.dataset.id });
            });
        }
    }
}