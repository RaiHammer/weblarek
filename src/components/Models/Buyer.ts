import { EventEmitter } from '../base/Events';
import { IBuyer, TPayment, ValidationResult } from '../../types/index';

export class Buyer extends EventEmitter {
    private payment: TPayment | '' = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor() {
        super();
    }

    setData(data: Partial<IBuyer>): void {
        let changed = false;

        if (data.payment !== undefined && data.payment !== this.payment) {
            this.payment = data.payment;
            changed = true;
            this.emit('buyer:payment-changed', { payment: data.payment });
        }

        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            changed = true;
            this.emit('buyer:email-changed', { email: data.email });
        }

        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            changed = true;
            this.emit('buyer:phone-changed', { phone: data.phone });
        }

        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            changed = true;
            this.emit('buyer:address-changed', { address: data.address });
        }

        if (changed) {
            this.emit('buyer:changed', { data: this.getData() });
            
            const validation = this.validate();
            const isValid = this.isValid(validation);
            this.emit('buyer:validated', { isValid, errors: validation });
            
            if (isValid) {
                this.emit('buyer:ready', {});
            }
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clearData(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        
        this.emit('buyer:cleared', {});
        this.emit('buyer:changed', { data: this.getData() });
        this.emit('buyer:validated', { isValid: false, errors: this.validate() });
    }

    validate(): ValidationResult {
        const errors: ValidationResult = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.email) {
            errors.email = 'Укажите емэйл';
        } else if (!this.isValidEmail(this.email)) {
            errors.email = 'Введите корректный email';
        }

        if (!this.phone) {
            errors.phone = 'Укажите телефон';
        } else if (!this.isValidPhone(this.phone)) {
            errors.phone = 'Введите корректный телефон';
        }

        if (!this.address) {
            errors.address = 'Укажите адрес';
        } else if (this.address.length < 5) {
            errors.address = 'Адрес должен содержать не менее 5 символов';
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 10;
    }

    private isValid(validationResult: ValidationResult): boolean {
        return Object.keys(validationResult).length === 0;
    }

    // Дополнительные методы для удобства
    setPayment(payment: TPayment): void {
        this.setData({ payment });
    }

    setEmail(email: string): void {
        this.setData({ email });
    }

    setPhone(phone: string): void {
        this.setData({ phone });
    }

    setAddress(address: string): void {
        this.setData({ address });
    }

    isReady(): boolean {
        return this.isValid(this.validate());
    }
}