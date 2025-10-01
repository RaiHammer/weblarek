export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

export type TPayment = "online" | "upon receipt";

export type EventName = string | RegExp;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type ValidationResult = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
};
