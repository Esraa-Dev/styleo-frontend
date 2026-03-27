# Stylo - E-Commerce Frontend

## Graduation Project Documentation

## 📋 Project Overview

Stylo is a comprehensive e-commerce platform frontend built with Angular 21, providing a complete online shopping experience with customer-facing features and an admin management dashboard.

## 🚀 Key Features

### Customer Features
- **User Authentication**: Registration, login, and profile management
- **Product Catalog**: Browse products with filtering by category, subcategory, and search
- **Shopping Cart**: Add/remove items, update quantities, guest cart persistence
- **Checkout Process**: Place orders with cash on delivery
- **Order Tracking**: View order history and detailed order status
- **Product Reviews**: Submit and read customer reviews
- **Static Pages**: About Us, FAQ, Contact information pages

### Admin Features
- **Dashboard**: Sales reports, revenue statistics, order counts
- **Product Management**: Create, edit, delete products with image upload
- **Category Management**: Hierarchical categories and subcategories
- **Order Management**: View all orders, update order status
- **User Management**: View users, activate/deactivate accounts
- **Review Moderation**: Approve, reject, or ignore customer reviews
- **Content Management**: Edit About Us, FAQ, and Contact pages

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| Angular 21 | Frontend framework |
| Tailwind CSS | Styling and responsive design |
| RxJS | State management and reactive programming |
| Angular Router | Navigation and route guards |
| Reactive Forms | Form handling and validation |
| HTTP Interceptors | JWT token management and error handling |

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v21)

## 🔧 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/stylo-frontend.git
cd stylo-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment

Update `src/environments/environment.ts` for development:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  uploadsUrl: 'http://localhost:3000/uploads'
};
```

Update `src/environments/environment.prod.ts` for production:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api/v1',
  uploadsUrl: 'https://your-api-domain.com/uploads'
};
```

### Step 4: Start Development Server
```bash
ng serve
```

Navigate to `http://localhost:4200`. The application will automatically reload on code changes.

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                      # Admin panel components
│   │   ├── dashboard/              # Dashboard with sales statistics
│   │   ├── products/               # Product CRUD operations
│   │   ├── categories/             # Category & subcategory management
│   │   ├── orders/                 # Order management
│   │   ├── users/                  # User management
│   │   ├── reviews/                # Review moderation
│   │   └── pages/                  # Static page content management
│   │
│   ├── core/                       # Core functionality
│   │   ├── services/               # API communication services
│   │   │   ├── auth.service.ts     # Authentication
│   │   │   ├── cart.service.ts     # Shopping cart
│   │   │   ├── product.service.ts  # Product operations
│   │   │   ├── category.service.ts # Category operations
│   │   │   ├── order.service.ts    # Order operations
│   │   │   ├── review.service.ts   # Review operations
│   │   │   ├── user.service.ts     # User operations
│   │   │   └── page.service.ts     # Static pages
│   │   ├── guards/                 # Route protection
│   │   │   ├── auth.guard.ts       # Authenticated users only
│   │   │   ├── admin.guard.ts      # Admin users only
│   │   │   └── guest.guard.ts      # Non-authenticated users only
│   │   ├── interceptors/           # HTTP request/response handling
│   │   │   ├── auth.interceptor.ts # Adds JWT token to requests
│   │   │   └── error.interceptor.ts # Handles HTTP errors
│   │   ├── models/                 # TypeScript interfaces
│   │   │   └── index.ts            # All data models
│   │   └── constants/              # Application constants
│   │       └── app.constants.ts    # API endpoints, storage keys, pagination
│   │
│   ├── features/                   # Customer-facing pages
│   │   ├── home/                   # Landing page with featured products
│   │   ├── products/               # Product listing with filters
│   │   ├── product-detail/         # Individual product view
│   │   ├── cart/                   # Shopping cart management
│   │   ├── checkout/               # Order placement
│   │   ├── orders/                 # Order history
│   │   ├── order-detail/           # Single order details
│   │   ├── profile/                # User profile management
│   │   ├── about/                  # About Us page
│   │   ├── contact/                # Contact page
│   │   ├── faq/                    # Frequently asked questions
│   │   ├── testimonials/           # Customer reviews
│   │   ├── login/                  # User login
│   │   └── register/               # User registration
│   │
│   ├── shared/                     # Reusable components
│   │   ├── components/
│   │   │   ├── header/             # Navigation header
│   │   │   ├── footer/             # Site footer
│   │   │   ├── cart-icon/          # Cart indicator
│   │   │   └── product-card/       # Product display card
│   │   └── pipes/
│   │       └── currency.pipe.ts    # Currency formatting
│   │
│   ├── app.component.ts            # Root component
│   ├── app.routes.ts               # Routing configuration
│   └── app.config.ts               # Application configuration
│
├── assets/                         # Static assets (images, icons)
├── environments/                   # Environment configurations
│   ├── environment.ts              # Development environment
│   └── environment.prod.ts         # Production environment
│
└── styles.css                      # Global styles with Tailwind CSS
```

## 🔐 Authentication Flow

1. **Login**: User submits credentials → API validates → JWT token stored
2. **Register**: New user creation → Auto-login after registration
3. **Token Storage**: JWT stored in localStorage
4. **Auth Interceptor**: Automatically adds `Authorization: Bearer <token>` to all requests
5. **Route Guards**: Protect routes based on authentication status
6. **Logout**: Clear token and redirect to home

## 🛒 Cart System

### Guest Cart
- Items stored in localStorage
- Persists across page refreshes
- Merged with user cart after login/registration

### User Cart
- Stored in database
- Real-time price change detection
- Automatic stock validation

## 📊 State Management

The application uses RxJS BehaviorSubjects for state management:
- `AuthService`: User state and authentication status
- `CartService`: Cart data and item count
- Components subscribe to observables for real-time updates


Responsive breakpoints:
- Mobile: Default (single column)
- Tablet: `md:` (2-3 column grid)
- Desktop: `lg:` (full layout)

## 🔄 Data Flow

1. **Components** → Dispatch actions via services
2. **Services** → Make HTTP requests to backend API
3. **Interceptors** → Add auth tokens, handle errors
4. **Observables** → Return data to components
5. **Components** → Update UI based on data changes


## 📱 Responsive Design

The application is fully responsive:
- **Mobile (<768px)**: Stacked layout, hamburger menu
- **Tablet (768px-1024px)**: 2-column product grid
- **Desktop (>1024px)**: Sidebar filters, 3-4 column product grid

## 🚦 Route Structure

| Route | Component | Guard |
|-------|-----------|-------|
| `/` | Redirect to /home | - |
| `/home` | Home | Public |
| `/products` | Products | Public |
| `/products/:slug` | ProductDetail | Public |
| `/cart` | Cart | Public |
| `/checkout` | Checkout | Auth |
| `/orders` | Orders | Auth |
| `/orders/:id` | OrderDetail | Auth |
| `/profile` | Profile | Auth |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/faq` | Faq | Public |
| `/testimonials` | Testimonials | Public |
| `/login` | Login | Guest |
| `/register` | Register | Guest |
| `/admin` | Dashboard | Admin |
| `/admin/products` | AdminProducts | Admin |
| `/admin/categories` | AdminCategories | Admin |
| `/admin/orders` | AdminOrders | Admin |
| `/admin/users` | AdminUsers | Admin |
| `/admin/reviews` | AdminReviews | Admin |
| `/admin/pages` | AdminPages | Admin |

## 🔌 API Integration

The frontend communicates with the backend through services that handle:
- Authentication (login, register, logout)
- Product listing, filtering, and details
- Cart operations (add, update, remove)
- Order placement and tracking
- User profile management
- Admin operations (CRUD for all entities)

## 🛡️ Security Features

- JWT tokens for authenticated requests
- Route guards for protected pages
- HTTP interceptor for token injection
- Input validation with reactive forms
- XSS protection through Angular's sanitization

## 📈 Performance Optimizations

- Lazy loading of feature modules
- OnPush change detection strategy
- TrackBy functions for ngFor loops
- Image optimization with proper sizing
- Debounced search inputs


## 📄 License

This project is created for educational purposes as part of graduation requirements.
