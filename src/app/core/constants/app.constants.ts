export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  GUEST_CART: 'guest_cart'
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CART: '/cart',
  ORDERS: '/orders',
  REVIEWS: '/testimonials',
  PAGES: '/pages',
  USERS: '/users'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  ADMIN_LIMIT: 20
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];