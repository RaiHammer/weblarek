import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface HeaderData {
    counter: number;
}

export class Header extends Component<HeaderData> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.counterElement = this.container.querySelector('.header__basket-counter') as HTMLElement;
        this.basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
        
        if (!this.counterElement) {
            throw new Error('Counter element not found in header');
        }
        
        if (!this.basketButton) {
            throw new Error('Basket button not found in header');
        }
        
        this.attachEventListeners();
    }

    render(data: HeaderData): HTMLElement {
        this.setCounter(data.counter);
        return this.container;
    }

    private setCounter(value: number): void {
        this.counterElement.textContent = String(value);
        // Скрываем счетчик если 0
        this.counterElement.style.display = value > 0 ? 'block' : 'none';
    }

    private attachEventListeners(): void {
        this.basketButton.addEventListener('click', () => {
            this.events.emit('header:open-cart');
        });
    }
}