// src/components/Api/ShopApi.ts
import { IApi, IProduct, IOrder, IOrderResult } from '../../types/index';

export class ShopApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Получает список товаров с сервера
     * @returns Промис с массивом товаров
     */
    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.api.get('/product/');
            // Предполагаем, что сервер возвращает объект с полем items
            return (response as any).items as IProduct[];
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
            throw error;
        }
    }

    /**
     * Отправляет заказ на сервер
     * @param orderData Данные заказа
     * @returns Промис с результатом оформления заказа
     */
    async submitOrder(orderData: IOrder): Promise<IOrderResult> {
        try {
            const response = await this.api.post('/order/', orderData);
            return response as IOrderResult;
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}