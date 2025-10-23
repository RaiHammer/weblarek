import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { TPayment } from '../../../types/index';


interface OrderFormData {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<OrderFormData> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'order');
        this.paymentButtons = this.formElement.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
        this.addressInput = this.formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.attachPaymentListeners();
    }

    render(data: OrderFormData): HTMLElement {
        this.setPaymentMethod(data.payment);
        this.setAddress(data.address);
        return this.container;
    }

    setPaymentMethod(method: TPayment): void {
        this.paymentButtons.forEach(button => {
            const paymentType = button.name === 'card' ? 'online' : 'upon receipt';
            const isActive = paymentType === method;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    setAddress(address: string): void {
        this.addressInput.value = address;
    }

    setSubmitButtonState(disabled: boolean): void {
        if (this.submitButton) {
            this.submitButton.disabled = disabled;
        }
    }

    private attachPaymentListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const paymentMethod: TPayment = button.name === 'card' ? 'online' : 'upon receipt';
                this.events.emit('payment:change', { payment: paymentMethod });
            });
        });
    }
}