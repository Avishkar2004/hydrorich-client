# Hydrorich Client

This is the frontend application for Hydrorich, built with React, Vite, and TypeScript. The application provides a modern interface for managing agricultural products, user interactions, and real-time chat functionality.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn package manager
- Modern web browser

## Tech Stack

- React 19
- Vite 6
- TypeScript
- TailwindCSS
- Socket.io Client
- React Router DOM
- Zustand (State Management)
- Chart.js (for analytics)
- Framer Motion (for animations)

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Avishkar2004/hydrorich-client
cd client
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the client directory with the following variables:

```env
VITE_API_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview the production build locally

## Features

- User authentication (including Google OAuth)
- Product catalog and management
- Real-time chat with admin support
- Shopping cart functionality
- Order tracking
- Admin dashboard with analytics
- Responsive design
- Interactive product galleries

## Project Structure

```
client/
├── eslint.config.js           # ESLint configuration
├── index.html                 # Entry HTML file
├── package.json               # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── public/                   # Public assets
│   └── vite.svg
├── src/
│   ├── App.css               # Main application styles
│   ├── App.jsx               # Main application component
│   ├── decleration.d.ts
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   │   ├── Collections/      # Product collection images
│   │   │   ├── fungicide1.avif
│   │   │   ├── insectiicide1.avif
│   │   │   ├── micronutrients1.avif
│   │   │   ├── organic.avif
│   │   │   └── pgr.avif
│   │   ├── Logo.jpg
│   │   ├── Options/
│   │   │   └── crops.png
│   │   ├── products/
│   │   │   ├── Hydrorich.jpg
│   │   │   └── Hydrorich2.jpg
│   │   └── react.svg
│   ├── components/
│   │   ├── admin/           # Admin dashboard components
│   │   │   ├── AddProduct.jsx
│   │   │   ├── AdminAllProducts.jsx
│   │   │   ├── AdminMessenger.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── OrderAnalytics.jsx
│   │   │   ├── PaymentStatus.jsx
│   │   │   ├── PerformanceMetrics.jsx
│   │   │   └── ProtectedAdminRoute.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Messenger.jsx
│   │   └── pages/          # Main application pages
│   │       ├── AboutUs.jsx
│   │       ├── AddToCart.jsx
│   │       ├── AllProductDetail.jsx
│   │       ├── AllProducts.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── Contact.jsx
│   │       ├── FAQ.jsx
│   │       ├── Login.jsx
│   │       ├── Orders.jsx
│   │       ├── OrderSuccess.jsx
│   │       ├── OrderTracking.jsx
│   │       ├── Profile.jsx
│   │       ├── Settings.jsx
│   │       ├── SignUp.jsx
│   │       ├── Wishlist.jsx
│   │       ├── crop/
│   │       ├── fungicide/
│   │       ├── Insecticide/
│   │       ├── micronutrients/
│   │       ├── organicproduct/
│   │       └── pgr/
│   ├── config/
│   │   └── api.js          # API configuration
│   ├── hooks/
│   │   └── useAuth.js      # Authentication hook
│   ├── services/           # API services
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   └── wishlistService.js
│   ├── store/             # State management
│   │   ├── cartStore.js
│   │   ├── searchStore.js
│   │   └── wishlistStore.js
│   └── utils/
│       ├── socket.js      # Socket.io configuration
│       └── utils.js       # Utility functions
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # Node-specific TS config
└── vite.config.ts       # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment.