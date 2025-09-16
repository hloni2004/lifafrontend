export interface CartItem {
  id?: string; // uuid, optional
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}
