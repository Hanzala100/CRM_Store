export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    images?: string[];
  };
}

export interface Cart {
  id: number;
  guest_id: string | null;
  user_id: number | null;
  tenant_id: number;
  items: CartItem[];
  total: number;
}
