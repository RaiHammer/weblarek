import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';

interface ProductPreviewData extends IProduct {
    buttonText?: string;        // Добавляем для кнопки
    buttonDisabled?: boolean;   // Добавляем для кнопки
}

export class ProductPreview extends Product {
    protected descriptionElement: HTMLElement;
    protected addToCartButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-preview');
        
        this.descriptionElement = this.container.querySelector('.card__text') as HTMLElement;
        this.addToCartButton = this.container.querySelector('.card__button') as HTMLButtonElement;
        this.attachEventListeners();
    }

    render(data: ProductPreviewData): HTMLElement {
        // Сохраняем ID в dataset для событий
        this.container.dataset.id = data.id;
        
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.setProductImage(data.image, data.title);
        this.setCategory(data.category); // ТОЛЬКО ОДИН АРГУМЕНТ
        this.setDescription(data.description);
        
        // Кнопка получает готовые данные от презентера (без логики)
        if (this.addToCartButton) {
            this.addToCartButton.textContent = data.buttonText || 'В корзину';
            this.addToCartButton.disabled = data.buttonDisabled || false;
        }
        
        return this.container;
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