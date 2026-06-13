# YellowKart Web Application

A modern React-based web application for the YellowKart e-commerce platform. Built with TypeScript, Redux, and Material-UI.

## Features

- **Product Browsing**: Browse and search products
- **Shopping Cart**: Add/remove items from cart
- **User Authentication**: Register and login
- **Order Management**: View order history
- **Profile Management**: Update user profile
- **Responsive Design**: Works on desktop and tablet
- **Material-UI**: Professional UI components
- **Redux State Management**: Centralized state management

## Quick Start

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── ProfilePage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── redux/            # Redux store and reducers
│   ├── store.ts
│   └── reducers/
├── App.tsx
├── main.tsx
└── index.css
```

## Environment Setup

Create a `.env` file in the web directory:

```env
VITE_API_BASE_URL=http://localhost:8001
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- React 18
- TypeScript
- Redux with Redux Thunk
- Material-UI
- Styled Components
- Vite
- Axios

## API Integration

The web application connects to Quarkus backend services:

- User Service: `http://localhost:8001`
- Product Service: `http://localhost:8002`
- Cart Service: `http://localhost:8003`
- Order Service: `http://localhost:8004`
- Payment Service: `http://localhost:8005`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
