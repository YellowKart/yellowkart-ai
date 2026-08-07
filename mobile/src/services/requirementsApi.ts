import axios from 'axios';
import { API } from '../config';

export type ProductItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  unit?: string;
};

export type CategoryGroup = {
  category: string;
  items: ProductItem[];
};

export async function fetchProductsByCategory(): Promise<CategoryGroup[]> {
  const response = await axios.get(`${API.products}/by-category`);
  return response.data;
}

export async function submitBulkOrder(payload: {
  userId: number;
  shippingAddress: string;
  paymentMethod?: string;
  items: Array<{
    productId: number;
    productName: string;
    brand?: string;
    unitPrice: number;
    quantity: number;
  }>;
}) {
  const response = await axios.post(`${API.orders}/bulk`, payload);
  return response.data;
}
