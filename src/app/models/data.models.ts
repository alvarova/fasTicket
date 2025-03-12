export interface User {
    cuit: string;
    pin: string;
}

export interface TicketItem {
    id: string;
    amount: number;
    description: string;
    paymentMethod: PaymentMethod;
    timestamp: Date;
    selected?: boolean;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface TicketState {
    items: TicketItem[];
    subtotal: number;
}