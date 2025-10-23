import { IProduct, IBuyer, TPayment, ValidationResult } from './index';

// События ProductList
export interface IProductListEvents {
    'productlist:changed': IProduct[];
    'productlist:selected': IProduct;
}

// События Cart
export interface ICartEvents {
    'cart:changed': IProduct[];
    'cart:item-added': IProduct;
    'cart:item-removed': IProduct;
    'cart:cleared': void;
}

// События Buyer
export interface IBuyerEvents {
    'buyer:changed': Partial<IBuyer>;
    'buyer:validated': { isValid: boolean; errors: ValidationResult };
    'buyer:cleared': void;
}