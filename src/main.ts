import "./scss/styles.scss";

// Импорты моделей
import { ProductList } from "./components/Models/ProductList";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";

// Импорты API
import { ShopApi } from "./components/Api/ShopApi";
import { Api } from "./components/base/Api";

// Импорты представлений
import { Gallery } from "./components/views/Gallery";
import { Header } from "./components/views/Header";
import { Modal } from "./components/views/Modal/Modal";
import { Basket } from "./components/views/Basket";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { ModalSuccess } from "./components/views/Modal/ModalSuccess";
import { ProductCard } from "./components/views/Product/ProductCard";
import { ProductPreview } from "./components/views/Product/ProductPreview";
import { BasketItem } from "./components/views/Product/BasketItem";

// Импорты базовых классов и типов
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";
import { IProduct, IOrder, TPayment, ValidationResult } from "./types";
import { cloneTemplate } from "./utils/utils";

// Инициализация брокера событий
const events = new EventEmitter();

// Инициализация API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Инициализация моделей
const productsModel = new ProductList();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Инициализация представлений
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Создаем остальные компоненты из шаблонов
const basketContainer = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(basketContainer, events);

const orderFormContainer = cloneTemplate<HTMLElement>('#order');
const orderForm = new OrderForm(orderFormContainer, events);

const contactsFormContainer = cloneTemplate<HTMLElement>('#contacts');
const contactsForm = new ContactsForm(contactsFormContainer, events);

const modalSuccessContainer = cloneTemplate<HTMLElement>('#success');
const modalSuccess = new ModalSuccess(modalSuccessContainer, events);

// Основная логика презентера
class AppPresenter {
    constructor() {
        this.initEventListeners();
        this.loadProducts();
    }

    private initEventListeners(): void {
        // События от моделей данных
        productsModel.on('productlist:changed', this.handleProductsChange.bind(this));
        productsModel.on('productlist:selected', this.handleProductSelected.bind(this));
        
        cartModel.on('cart:changed', this.handleCartChange.bind(this));
        
        buyerModel.on('buyer:changed', this.handleBuyerChange.bind(this));

        // События от представлений
        events.on('card:select', this.handleCardSelect.bind(this));
        events.on('card:add-to-cart', this.handleCardAddToCart.bind(this));
        events.on('preview:add-to-cart', this.handlePreviewAddToCart.bind(this));
        events.on('basket:remove', this.handleBasketRemove.bind(this));
        events.on('header:open-cart', this.handleHeaderOpenCart.bind(this));
        events.on('basket:checkout', this.handleBasketCheckout.bind(this));
        events.on('order:submit', this.handleOrderSubmit.bind(this));
        events.on('contacts:submit', this.handleContactsSubmit.bind(this));
        events.on('payment:change', this.handlePaymentChange.bind(this));
        events.on('modal:close', this.handleModalClose.bind(this));
        events.on('success:close', this.handleSuccessClose.bind(this));
    }

    private async loadProducts(): Promise<void> {
        try {
            const products = await shopApi.getProductList();
            productsModel.setProducts(products);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

// Обработчики событий моделей
private handleProductsChange(): void {
    const products = productsModel.getProducts();
    console.log('Products loaded:', products.length, 'items');
    
    const productCards = products.map(product => {
        try {
            const cardContainer = document.createElement('div');
            const card = new ProductCard(cardContainer, events);
            const cardElement = card.render(product);
            return cardElement;
        } catch (error) {
            console.error('Error creating product card:', error, product);
            const fallbackElement = document.createElement('div');
            fallbackElement.className = 'gallery__item card';
            fallbackElement.innerHTML = `
                <h2 class="card__title">${product.title}</h2>
                <span class="card__price">${product.price} синапсов</span>
            `;
            return fallbackElement;
        }
    });
    
    gallery.render({ items: productCards });
}

    private handleProductSelected(): void {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    try {
        const previewContainer = document.createElement('div');
        const preview = new ProductPreview(previewContainer, events);
        
        const previewContent = preview.render(product);
        // Обновляем состояние кнопки в превью
        this.updateProductPreviewState(previewContent, product);
        
        modal.render({ content: previewContent });
        modal.open();
    } catch (error) {
        console.error('Error creating product preview:', error);
    }
}

    private handleCartChange(): void {
        const items = cartModel.getItems();
        const basketItems = items.map((item, index) => {
            const itemContainer = cloneTemplate<HTMLElement>('#card-basket');
            const basketItem = new BasketItem(itemContainer, events);
            return basketItem.render({ ...item, index: index + 1 });
        });
        
        // Логика в презентере!
        const canCheckout = cartModel.canCheckout();
        const buttonText = canCheckout ? 'Оформить' : 'Корзина пуста';
        
        basket.render({
            items: basketItems,
            total: cartModel.getTotalPrice()
        });
        basket.setButtonState(buttonText, !canCheckout);
        
        // Обновляем счетчик в хедере
        header.render({ counter: cartModel.getItemsCount() });
        
    }

    private handleBuyerChange(): void {
        const buyerData = buyerModel.getData();
        const validation = buyerModel.validate();
        
        // Обновляем форму заказа
        orderForm.render({
            payment: buyerData.payment,
            address: buyerData.address
        });
        orderForm.setSubmitButtonState(!buyerData.payment || !buyerData.address);
        
        // Обновляем форму контактов
        contactsForm.render({
            email: buyerData.email,
            phone: buyerData.phone
        });
        contactsForm.setSubmitButtonState(!buyerData.email || !buyerData.phone);
    }

    // Обработчики событий представлений
    private handleCardSelect(data: { id: string }): void {
        const product = productsModel.getProductById(data.id);
        if (product) {
            productsModel.setSelectedProduct(product);
        }
    }

    private handleCardAddToCart(data: { id: string }): void {
        const product = productsModel.getProductById(data.id);
        if (product && product.price !== null) {
            cartModel.addItem(product);
        }
    }

    private handlePreviewAddToCart(data: { id: string }): void {
        this.handleCardAddToCart(data);
        modal.close();
    }

    private handleBasketRemove(data: { id: string }): void {
        cartModel.removeItemById(data.id);
    }

    private handleHeaderOpenCart(): void {
        modal.render({ content: basket.element });
        modal.open();
    }

    private handleBasketCheckout(): void {
        modal.render({ content: orderForm.element });
        modal.open();
    }

    private handleOrderSubmit(): void {
        const validation = buyerModel.validate();
        
        if (!validation.payment && !validation.address) {
            modal.render({ content: contactsForm.element });
        } else {
            // Показываем ошибки
            const errorMessages = this.getErrorMessages(validation);
            // Можно добавить отображение ошибок в форме
        }
    }

    private handleContactsSubmit(): void {
        if (buyerModel.isReady() && cartModel.canCheckout()) {
            this.submitOrder();
        } else {
            const validation = buyerModel.validate();
            const errorMessages = this.getErrorMessages(validation);
            // Можно добавить отображение ошибок в форме
        }
    }

    private handlePaymentChange(data: { payment: TPayment }): void {
        buyerModel.setData({ payment: data.payment });
    }

    private handleModalClose(): void {
        productsModel.clearSelectedProduct();
    }

    private handleSuccessClose(): void {
        modal.close();
        cartModel.clearCart();
        buyerModel.clearData();
    }


    private updateProductPreviewState(previewElement: HTMLElement, product: IProduct): void {
        const inCart = cartModel.containsItem(product.id);
        const buttonText = this.getButtonText(product.price, inCart);
        const buttonDisabled = product.price === null || inCart;
        
        const button = previewElement.querySelector('.card__button') as HTMLButtonElement;
        if (button) {
            button.textContent = buttonText;
            button.disabled = buttonDisabled;
        }
    }


    private getButtonText(price: number | null, inCart: boolean): string {
        if (price === null) return 'Недоступно';
        if (inCart) return 'Уже в корзине';
        return 'В корзину';
    }

    private getErrorMessages(validation: ValidationResult): string[] {
        return Object.values(validation).filter(Boolean) as string[];
    }

    private async submitOrder(): Promise<void> {
        try {
            const orderData: IOrder = {
                ...buyerModel.getData(),
                total: cartModel.getTotalPrice(),
                items: cartModel.getItemIds()
            };

            const result = await shopApi.submitOrder(orderData);
            
            modalSuccess.render({ total: result.total });
            modal.render({ content: modalSuccess.element });
            
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
        }
    }
}

// Инициализация приложения
new AppPresenter();