import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./features/products/products').then(m => m.Products) },
  { path: 'products/:slug', loadComponent: () => import('./features/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.Cart) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./features/orders/orders').then(m => m.Orders), canActivate: [authGuard] },
  { path: 'orders/:id', loadComponent: () => import('./features/order-detail/order-detail').then(m => m.OrderDetail), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.Contact) },
  { path: 'faq', loadComponent: () => import('./features/faq/faq').then(m => m.Faq) },
  { path: 'testimonials', loadComponent: () => import('./features/testimonials/testimonials').then(m => m.Testimonials) },
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login), canActivate: [guestGuard] },
  { path: 'register', loadComponent: () => import('./features/register/register').then(m => m.Register), canActivate: [guestGuard] },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'products', loadComponent: () => import('./admin/products/products').then(m => m.AdminProducts) },
      { path: 'categories', loadComponent: () => import('./admin/categories/categories').then(m => m.AdminCategories) },
      { path: 'orders', loadComponent: () => import('./admin/orders/orders').then(m => m.AdminOrders) },
      { path: 'orders/:id', loadComponent: () => import('./features/order-detail/order-detail').then(m => m.OrderDetail) },
      { path: 'users', loadComponent: () => import('./admin/users/users').then(m => m.AdminUsers) },
      { path: 'reviews', loadComponent: () => import('./admin/reviews/reviews').then(m => m.AdminReviews) },
      { path: 'pages', loadComponent: () => import('./admin/pages/pages').then(m => m.AdminPages) }
    ]
  },
  { path: '**', redirectTo: '/home' }
];