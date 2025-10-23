import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export abstract class Form<T> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, protected templateId: string) {
        super(container);

        const template = ensureElement<HTMLTemplateElement>(`#${this.templateId}`);
        this.formElement = template.content.querySelector('form')?.cloneNode(true) as HTMLFormElement;
        
        if (!this.formElement) {
            throw new Error(`Форма не найдена в шаблоне ${this.templateId}`);
        }

        this.submitButton = this.formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = this.formElement.querySelector('.form__errors') as HTMLElement;

        this.container.appendChild(this.formElement);
        this.attachEventListeners();
    }

    protected attachEventListeners(): void {
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(`${this.templateId}:submit`);
        });

        // Очищаем ошибки при вводе
        this.formElement.addEventListener('input', () => {
            this.clearErrors();
        });
    }

    protected setErrors(errors: string[]): void {
        if (this.errorsElement) {
            this.errorsElement.innerHTML = '';
            errors.forEach(error => {
                const errorElement = document.createElement('div');
                errorElement.className = 'form__error';
                errorElement.textContent = error;
                this.errorsElement.appendChild(errorElement);
            });
        }
    }

    protected clearErrors(): void {
        if (this.errorsElement) {
            this.errorsElement.innerHTML = '';
        }
    }
}