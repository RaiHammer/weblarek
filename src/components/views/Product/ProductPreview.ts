import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';
import { ensureElement } from '../../../utils/utils';



export class ProductPreview extends Product {
    protected descriptionElement: HTMLElement;
    protected addToCartButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-preview');
        
        // Находим элементы по существующей разметке
        const templateElement = this.container.querySelector('.card') as HTMLElement;
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', templateElement);
        this.addToCartButton = ensureElement<HTMLButtonElement>('.card__button', templateElement);
        
        this.attachEventListeners();
    }

    render(data: IProduct): HTMLElement {
        this.container.dataset.id = data.id;
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.setProductImage(data.image, data.title);
        this.setCategory(data.category);
        this.setDescription(data.description);
        return this.container;
    }

    setButtonState(text: string, disabled: boolean): void {
        if (this.addToCartButton) {
            this.addToCartButton.textContent = text;
            this.addToCartButton.disabled = disabled;
        }
    }

    private setDescription(description: string): void {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = description;
        }
    }

    private attachEventListeners(): void {
        if (this.addToCartButton) {
            this.addToCartButton.addEventListener('click', () => {
                this.events.emit('preview:add-to-cart', { id: this.container.dataset.id });
            });
        }
    }
}