import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types/index';
import { categoryMap } from '../../../utils/constants';

export abstract class Product extends Component<IProduct> {
    protected productElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, templateId: string) {
        super(container);
        
        const template = ensureElement<HTMLTemplateElement>(`#${templateId}`);
        this.productElement = template.content.querySelector('.card')?.cloneNode(true) as HTMLElement;
        
        if (!this.productElement) {
            throw new Error(`Основной элемент товара не найден в шаблоне ${templateId}`);
        }

        // Находим элементы один раз в конструкторе
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.productElement);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.productElement);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.productElement);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.productElement);

        this.container.appendChild(this.productElement);
    }

    // Базовые методы только для отображения - без логики
    setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    setPrice(price: number | null): void {
        this.priceElement.textContent = price ? `${price} синапсов` : 'Бесценно';
    }

    setProductImage(src: string, alt?: string): void {
        this.setImage(this.imageElement, src, alt); // Используем метод из Component
    }

    setCategory(category: string): void {
        const categoryClass = categoryMap[category as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.textContent = category;
        this.categoryElement.className = `card__category ${categoryClass}`;
    }
}