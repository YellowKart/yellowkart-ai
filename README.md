# YellowKart - E-Commerce Application

A comprehensive e-commerce platform similar to Amazon, built with Java Quarkus backend and React Native mobile application.

## Project Structure

```
yellowkart-ai/
├── backend/                 # Quarkus microservices
│   ├── user-service/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── payment-service/
│   └── notification-service/
├── mobile/                  # React Native app
│   ├── ios/
│   ├── android/
│   └── src/
├── docker-compose.yml
└── docs/
```

## Tech Stack

### Backend
- **Framework**: Java Quarkus 3.x
- **Database**: PostgreSQL
- **Message Queue**: RabbitMQ
- **Cache**: Redis
- **API**: REST with OpenAPI/Swagger
- **Authentication**: JWT + OAuth2

### Mobile
- **Framework**: React Native
- **State Management**: Redux
- **Navigation**: React Navigation
- **Payment Integration**: Stripe

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm or yarn
- Docker & Docker Compose
- PostgreSQL 14+

## Quick Start

### Backend Setup

```bash
cd backend
mvn clean install

# Run all services with Docker Compose
docker-compose up -d

# Run individual service
cd user-service
mvn quarkus:dev
```

### Mobile Setup

```bash
cd mobile
npm install

# iOS
cd ios
pod install
cd ..
npm run ios

# Android
npm run android
```

## API Documentation

Once services are running, visit:
- User Service: http://localhost:8001/q/swagger-ui/
- Product Service: http://localhost:8002/q/swagger-ui/
- Cart Service: http://localhost:8003/q/swagger-ui/
- Order Service: http://localhost:8004/q/swagger-ui/
- Payment Service: http://localhost:8005/q/swagger-ui/

## Database Schema

Database migrations are managed using Flyway.

## Contributing

1. Create a feature branch from `develop`
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
