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
        }

        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            changed = true;
        }

        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            changed = true;
        }

        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            changed = true;
        }

        if (changed) {
            this.emit('buyer:changed', this.getData());
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
        this.emit('buyer:cleared');
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

    isReady(): boolean {
        return Object.keys(this.validate()).length === 0;
    }
}