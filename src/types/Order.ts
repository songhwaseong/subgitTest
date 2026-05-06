interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface Order {
    name: string;
    orderId: number;
    orderDate: string; // 날짜는 보통 string으로 받음
    status: string;
    email: string;
    orderItems: OrderItem[];
    manageId: number;
}