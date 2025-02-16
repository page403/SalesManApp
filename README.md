# Salesman Order Taking App 📱

A mobile application built with Expo and React Native that helps salespeople manage customer orders efficiently.

![App Preview](https://raw.githubusercontent.com/page403/SalesManApp/refs/heads/main/screenshots/salesmanApp-prev.jpg) <!-- Replace with actual app screenshots -->

## Features

### 🏪 Customer Management
- View list of customers/stores
- Add new customers with details
- Track customer locations and schedules

### 📝 Order Management
- Create new orders with multiple products
- Select quantity and unit type (pieces, carton, middle)
- Real-time price calculation
- Swipe to delete orders

### 📊 Sales Analytics
- Daily sales comparison
- Monthly average comparison
- Order history tracking
- Total sales calculation

### 👤 User Authentication
- Secure login system
- User registration with admin approval
- Role-based access control

## App Preview

<!-- Add actual screenshots of your app here -->
| Home Screen | Order Screen | Cart Screen |
|------------|--------------|-------------|
| ![Home](https://i.imgur.com/example1.png) | ![Order](https://i.imgur.com/example2.png) | ![Cart](https://i.imgur.com/example3.png) |

## Technology Stack

- **Frontend**: React Native with Expo
- **State Management**: React Context
- **Database**: Supabase
- **UI Components**: Native components with custom styling
- **Navigation**: Expo Router
- **Authentication**: Custom auth with Supabase

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your preferred platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## Project Structure

```
src/
├── app/                 # Main application screens
│   ├── (tabs)/         # Tab-based navigation screens
│   ├── toko/           # Store/customer related screens
│   └── order-detail/   # Order management screens
├── components/         # Reusable UI components
├── context/           # Application context (Auth, etc.)
└── utils/            # Utility functions and configs
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Screenshots Description

### Home Screen
- Customer list with search functionality
- Quick access to daily statistics
- Add new customer button
- Category filtering

### Order Screen
- Product catalog with images
- Price selection (PCS/CTN/MID)
- Quantity input
- Real-time total calculation

### Cart Screen
- Daily order summary
- Customer-wise order grouping
- Total sales calculation
- Date selection for historical data

---

For more information about the frameworks and libraries used:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com/)
