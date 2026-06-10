export type Screen =
  | "splash"
  | "onboarding"
  | "login"
  | "register"
  | "otp"
  | "home"
  | "calculator"
  | "buy"
  | "sell"
  | "card"
  | "insurance"
  | "orders"
  | "orderDetail"
  | "kyc"
  | "profile"
  | "support";

export type OrderType = "BUY_FOREX" | "SELL_FOREX" | "FOREX_CARD" | "CARD_RELOAD";

export type Order = {
  id: string;
  orderNumber: string;
  type: OrderType | string;
  currencyCode: string;
  amount: string | number;
  status: string;
  rate?: string | number;
  events?: Array<{ id: string; title: string; message?: string | null; createdAt?: string }>;
};

export type RouteState = {
  screen: Screen;
  selectedOrder?: Order;
};
