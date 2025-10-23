import { Product } from './Product';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types/index';





export class ProductCard extends Product {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, 'card-catalog');
        this.attachEventListeners();
    }

    render(data: IProduct): HTMLElement {
        this.container.dataset.id = data.id;
        this.setTitle(data.title);
        this.setPrice(data.price);
        this.setProductImage(data.image, data.title);
        this.setCategory(data.category);
        return this.container;
    }

    private attachEventListeners(): void {
        // Вся карточка - это кнопка, вешаем обработчик на контейнер
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this.container.dataset.id });
        });
    }
}