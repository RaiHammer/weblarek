import { Form } from './Form';
import { IEvents } from '../../base/Events';


interface ContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<ContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'contacts');
        this.emailInput = this.formElement.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.formElement.querySelector('input[name="phone"]') as HTMLInputElement;
    }

    render(data: ContactsFormData): HTMLElement {
        this.setEmail(data.email);
        this.setPhone(data.phone);
        return this.container;
    }

    setEmail(email: string): void {
        this.emailInput.value = email;
    }

    setPhone(phone: string): void {
        this.phoneInput.value = phone;
    }

    setSubmitButtonState(disabled: boolean): void {
        if (this.submitButton) {
            this.submitButton.disabled = disabled;
        }
    }
}