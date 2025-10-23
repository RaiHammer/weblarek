import { Form } from './Form';
import { IEvents } from '../../base/Events';

interface ContactsFormData {
    email: string;
    phone: string;
    errors?: string[];
}

export class ContactsForm extends Form<ContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'contacts');

        this.emailInput = this.formElement.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        this.submitButton = this.formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        this.attachInputListeners();
    }

    render(data: ContactsFormData): HTMLElement {
        this.emailInput.value = data.email || '';
        this.phoneInput.value = data.phone || '';
        
        if (data.errors) {
            this.setErrors(data.errors);
        }
        
        this.updateSubmitButton();
        
        return this.container;
    }

    private attachInputListeners(): void {
        // Обновляем состояние кнопки при вводе
        this.emailInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }

    private updateSubmitButton(): void {
        const hasEmail = this.emailInput.value.trim().length > 0;
        const hasPhone = this.phoneInput.value.trim().length > 0;
        
        if (this.submitButton) {
            this.submitButton.disabled = !(hasEmail && hasPhone);
        }
    }
}