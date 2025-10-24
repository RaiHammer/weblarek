import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Product, IProduct } from "./Product";

export interface IProductInBasket extends IProduct {
  id: string;
  index?: number;
}

export class BasketItem extends Product<IProductInBasket> {
  protected id: string;
  protected indexElement: HTMLSpanElement;
  protected deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, {});
    this.id = '';
    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      events.emit('basket:deleteCard', { id: this.id });
    });
  }

  setId(value: string) {
    this.id = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}