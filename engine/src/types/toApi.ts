/* import { Order } from "../trade/Orderbook"; */


export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const GET_DEPTH = "GET_DEPTH";

export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "buy" | "sell";
    userId: string;
}

export type MessageToApi = {
    type: "DEPTH",
    payload: {
        bids: [string, string][],
        asks: [string, string][],
    }
} | {
    type: "ORDER_PLACED",
    payload: {
        orderId: string,
        executedQty: number,
        fills: {
            price: string,
            qty: number,
            tradeId: number
        }[]
    }
} | {
    type: "ORDER_CANCELLED",
    payload: {
        orderId: string,
        executedQty: number,
        remainingQty: number
    }
} | {
    type: "OPEN_ORDERS",
    payload: Order[]
}

export type MessageFromApi = {
    type: "CREATE_ORDER",
    data: {
        market: string,
        price: string,
        quantity: string,
        side: "buy" | "sell",
        userId: string  
    }
} | {
    type: "CANCEL_ORDER",
    data: {
        orderId: string,
        market: string
    }
} | {
    type: "GET_OPEN_ORDERS",
    data: {
        market: string,
        userId: string
    }
} | {
    type: "ON_RAMP",
    data: {
        userId: string,
        amount: string
    }
} | {
    type: "GET_DEPTH",
    data: {
        market: string,
    }
}