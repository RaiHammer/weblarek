import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface BasketData {
    items: HTMLElement[];
    total: number;
    buttonText?: string;
    buttonDisabled?: boolean;
}

export class Basket extends Component<BasketData> {
    protected itemsList: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.itemsList = this.container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = this.container.querySelector('.basket__button') as HTMLButtonElement;
        
        if (!this.itemsList) {
            throw new Error('Items list not found in basket');
        }
        
        this.attachEventListeners();
    }

    render(data: BasketData): HTMLElement {
        this.setItems(data.items);
        this.setTotal(data.total);
        this.setButtonState(data.buttonText, data.buttonDisabled);
        return this.container;
    }

    private setItems(items: HTMLElement[]): void {
        this.itemsList.innerHTML = '';
        items.forEach(item => this.itemsList.appendChild(item));
    }

    private setTotal(total: number): void {
        if (this.totalElement) {
            this.totalElement.textContent = `${total} синапсов`;
        }
    }

    private setButtonState(buttonText?: string, buttonDisabled?: boolean): void {
        if (this.buttonElement) {
            this.buttonElement.textContent = buttonText || 'Оформить';
            this.buttonElement.disabled = buttonDisabled || false;
        }
    }

    private attachEventListeners(): void {
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                this.events.emit('basket:checkout');
            });
        }
    }
}