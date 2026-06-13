# YellowKart Development Guide

## Prerequisites

- Java 17 or higher
- Maven 3.8 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL 14 or higher
- Xcode (for iOS development)
- Android Studio (for Android development)

## Setting up the Development Environment

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/fraghavendra/yellowkart-ai.git
   cd yellowkart-ai
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```

3. **Build backend services**
   ```bash
   cd backend
   mvn clean install
   ```

4. **Run individual services**
   ```bash
   cd user-service
   mvn quarkus:dev
   ```

### Mobile Setup

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

3. **Android Setup**
   ```bash
   npm run android
   ```

## Project Structure

### Backend
- Each service is a separate Maven module
- All services use Quarkus framework
- Database migrations use Flyway
- API documentation with OpenAPI/Swagger

### Mobile
- React Native with TypeScript
- Redux for state management
- React Navigation for routing
- Stripe integration for payments

## Code Style

### Java
- Use Java 17+ features
- Follow Oracle Java conventions
- Add Javadoc for public APIs
- Write unit tests for business logic

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow Airbnb style guide
- Use ESLint and Prettier
- Write tests for components

## Testing

### Backend
```bash
cd backend/[service-name]
mvn test
```

### Mobile
```bash
cd mobile
npm test
```

## Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Mobile
```bash
cd mobile

# iOS
npm run build:ios

# Android
npm run build:android
```

## Deployment

### Using Docker

1. **Build Docker images**
   ```bash
   docker build -t yellowkart-user-service ./backend/user-service
   docker build -t yellowkart-product-service ./backend/product-service
   # ... repeat for other services
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in application.properties
- Verify connection string

### Port Conflicts
- Each service runs on a different port (8001-8006)
- Check if ports are available
- Modify ports in application.properties if needed

### Mobile Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm start -- --reset-cache`
- Clear build: `cd ios && xcodebuild clean` or `cd android && ./gradlew clean`
