export interface CartProduct {
    cartProductId: number;
    productId: number;
    image: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
    stock: number;
    checked: boolean;
};