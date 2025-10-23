import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types/index';
import { categoryMap } from '../../../utils/constants';



export abstract class Product extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, templateId: string) {
        super(container);
        
        // Очищаем контейнер
        this.container.innerHTML = '';
        
        // Получаем шаблон
        const template = ensureElement<HTMLTemplateElement>(`#${templateId}`);
        const templateElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        
        if (!templateElement) {
            throw new Error(`Template ${templateId} has no content`);
        }

        this.container.appendChild(templateElement);

        // Находим элементы в добавленном шаблоне
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    }

    setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    setPrice(price: number | null): void {
        this.priceElement.textContent = price ? `${price} синапсов` : 'Бесценно';
    }

    setProductImage(src: string, alt?: string): void {
        this.setImage(this.imageElement, src, alt);
    }

    setCategory(category: string): void {
        const categoryClass = categoryMap[category as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.textContent = category;
        this.categoryElement.className = `card__category ${categoryClass}`;
    }
}