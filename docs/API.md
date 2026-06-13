# YellowKart API Documentation

## Services Overview

The YellowKart e-commerce platform consists of 6 microservices built with Quarkus:

### 1. User Service (Port 8001)
- User registration and authentication
- User profile management
- Address management

**Endpoints:**
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### 2. Product Service (Port 8002)
- Product catalog management
- Product search and filtering
- Category management

**Endpoints:**
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### 3. Cart Service (Port 8003)
- Shopping cart management
- Cart operations (add, remove, update items)
- Persistent cart storage

**Endpoints:**
- `GET /api/cart/{userId}` - Get user cart
- `POST /api/cart/{userId}/items` - Add item to cart
- `PUT /api/cart/{userId}/items/{productId}` - Update cart item
- `DELETE /api/cart/{userId}/items/{productId}` - Remove item from cart

### 4. Order Service (Port 8004)
- Order creation and management
- Order history
- Order status tracking

**Endpoints:**
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order

### 5. Payment Service (Port 8005)
- Payment processing
- Transaction management
- Payment status tracking

**Endpoints:**
- `GET /api/payments/order/{orderId}` - Get payment by order
- `POST /api/payments` - Process payment
- `PUT /api/payments/{id}` - Update payment

### 6. Notification Service (Port 8006)
- Email notifications
- Order updates
- Shipping notifications

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  stock INT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50),
  shipping_address VARCHAR(255),
  payment_method VARCHAR(50),
  order_date TIMESTAMP,
  delivery_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Getting Started

### Start all services
```bash
cd backend
mvn clean install
docker-compose up -d

# Start each service
cd user-service && mvn quarkus:dev
# In another terminal
cd product-service && mvn quarkus:dev
# And so on for other services
```

### Start mobile app
```bash
cd mobile
npm install
npm run ios
# or
npm run android
```
