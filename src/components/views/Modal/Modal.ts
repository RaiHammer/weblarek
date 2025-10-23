import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = this.container.querySelector('.modal__content') as HTMLElement;
        
        if (!this.closeButton) {
            throw new Error('Close button not found in modal');
        }
        
        if (!this.contentElement) {
            throw new Error('Content element not found in modal');
        }
        
        this.attachEventListeners();
    }

    render(data: ModalData): HTMLElement {
        this.setContent(data.content);
        return this.container;
    }

    setContent(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    }

    private attachEventListeners(): void {
        this.closeButton.addEventListener('click', () => this.close());
        
        // Клик по затемненной области (самому контейнеру модалки)
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.close();
        });

        // Предотвращаем закрытие при клике на контент
        this.contentElement.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
}