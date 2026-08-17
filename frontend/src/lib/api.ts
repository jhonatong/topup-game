import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  has_zone_id: boolean;
  is_active: boolean;
  products_count?: number;
  products?: Product[];
}

export interface Product {
  id: number;
  category_id: number;
  sku_code: string;
  name: string;
  price: number;
  is_active: boolean;
  category?: Category;
}

export interface Transaction {
  id: number;
  invoice_number: string;
  product_id: number;
  user_game_id: string;
  zone_game_id?: string;
  game_nickname: string;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'expired';
  fulfillment_status: 'pending' | 'processing' | 'success' | 'failed';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface PaymentDetails {
  reference: string;
  payment_method: string;
  amount: number;
  expired_at: string;
  qr_code_url?: string;
  virtual_account?: string;
  instructions: string;
}

// Public API functions
export async function getCategories(): Promise<Category[]> {
  const response = await api.get('/categories');
  return response.data.data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await api.get(`/categories/${slug}`);
  return response.data.data;
}

export async function checkGameUserId(categoryId: number, userGameId: string, zoneGameId?: string) {
  const response = await api.post('/check-id', {
    category_id: categoryId,
    user_game_id: userGameId,
    zone_game_id: zoneGameId,
  });
  return response.data;
}

export async function createOrder(data: {
  product_id: number;
  user_game_id: string;
  zone_game_id?: string;
  game_nickname: string;
  payment_method: string;
}) {
  const response = await api.post('/orders', data);
  return response.data;
}

export async function getOrderByInvoice(invoiceNumber: string) {
  const response = await api.get(`/orders/${invoiceNumber}`);
  return response.data;
}

export async function simulatePayment(invoiceNumber: string) {
  const response = await api.post('/simulator/pay', {
    invoice_number: invoiceNumber,
  });
  return response.data;
}

// Admin API functions
export async function createCategory(data: Partial<Category>) {
  const response = await api.post('/admin/categories', data);
  return response.data;
}

export async function updateCategory(id: number, data: Partial<Category>) {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: number) {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
}

export async function createProduct(data: Partial<Product>) {
  const response = await api.post('/admin/products', data);
  return response.data;
}

export async function updateProduct(id: number, data: Partial<Product>) {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
}

export async function getAdminTransactions(search?: string, paymentStatus?: string) {
  const response = await api.get('/admin/transactions', {
    params: { search, payment_status: paymentStatus },
  });
  return response.data;
}
