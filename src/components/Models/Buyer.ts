import { IBuyer, ValidationResult } from "../../types/index";

export class Buyer {
  private payment: string = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor() {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment as any,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearData(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): ValidationResult {
    const errors: ValidationResult = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите емэйл";
    }

    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
