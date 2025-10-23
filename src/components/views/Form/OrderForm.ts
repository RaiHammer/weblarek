import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { TPayment } from '../../../types/index';

interface OrderFormData {
    payment: TPayment;
    address: string;
    errors?: string[];
}

export class OrderForm extends Form<OrderFormData> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'order');

        this.paymentButtons = this.formElement.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
        this.addressInput = this.formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.submitButton = this.formElement.querySelector('.order__button') as HTMLButtonElement;
        
        if (this.paymentButtons.length === 0) {
            throw new Error('Payment buttons not found in order form');
        }
        
        this.attachPaymentListeners();
    }

    render(data: OrderFormData): HTMLElement {
        this.setPaymentMethod(data.payment);
        this.addressInput.value = data.address || '';
        
        if (data.errors) {
            this.setErrors(data.errors);
        }
        
        // Обновляем состояние кнопки
        this.updateSubmitButton();
        
        return this.container;
    }

    private setPaymentMethod(method: TPayment): void {
        this.paymentButtons.forEach(button => {
            const paymentType = button.name === 'card' ? 'online' : 'upon receipt';
            const isActive = paymentType === method;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    private attachPaymentListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const paymentMethod: TPayment = button.name === 'card' ? 'online' : 'upon receipt';
                this.events.emit('payment:change', { payment: paymentMethod });
            });
        });

        // Обновляем состояние кнопки при вводе адреса
        this.addressInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }

    private updateSubmitButton(): void {
        const hasAddress = this.addressInput.value.trim().length > 0;
        const hasPayment = Array.from(this.paymentButtons).some(btn => 
            btn.classList.contains('button_alt-active')
        );
        
        if (this.submitButton) {
            this.submitButton.disabled = !(hasAddress && hasPayment);
        }
    }
}