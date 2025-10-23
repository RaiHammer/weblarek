import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

interface ModalSuccessData {
    total: number;
}

export class ModalSuccess extends Component<ModalSuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
        
        this.attachEventListeners();
    }

    render(data: ModalSuccessData): HTMLElement {
        this.setTotal(data.total);
        return this.container;
    }

    private setTotal(total: number): void {
        this.descriptionElement.textContent = `Списано ${total} синапсов`;
    }

    private attachEventListeners(): void {
        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
}