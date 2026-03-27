export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  address?: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  gender: 'male' | 'female';
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: { user: User; token: string };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: { _id: string; name: string; slug: string };
  subcategory?: { _id: string; name: string; slug: string };
  stockCount: number;
  isDeleted: boolean;
}

export interface CartItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    stockCount: number;
  };
  quantity: number;
  priceAtAdd: number;
  priceChanged: boolean;
  currentPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  hasPriceChanges: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  deliveryPhone: string;
  deliveryAddress: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'COD';
  status: 'Pending' | 'Prepared' | 'Shipped' | 'Delivered' | 'CancelledByUser' | 'CancelledByAdmin' | 'Rejected';
  cancelledBy?: 'user' | 'admin';
  cancellationReason?: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  deliveryPhone: string;
  deliveryAddress: string;
}

export interface Review {
  _id: string;
  user: string | User;
  userName: string;
  reviewText: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected' | 'ignored';
  createdAt: string;
}

export interface CreateReviewPayload {
  reviewText: string;
  rating: number;
}

export interface StaticPage {
  _id: string;
  pageKey: 'about_us' | 'faq' | 'contact_us';
  content: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: string;
}

export interface AdminProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface AdminUserQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationCounts {
  newOrders: number;
  outOfStock: number;
}

export interface SalesReport {
  period: { from: string; to: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  topProducts: Array<{
    _id: string;
    productName: string;
    totalSold: number;
    totalRevenue: number;
  }>;
}