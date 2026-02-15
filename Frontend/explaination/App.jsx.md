# App.jsx

The central hub for routing and global application state management.

## Key Features
- **React Router**: Defines the application's navigation structure using `createBrowserRouter`.
- **Route Guards**: Uses `PublicRoute` and `ProtectedRoute` components to manage access to pages like `/avatar` and `/account`.
- **Query Client**: Provides `QueryClientProvider` from TanStack Query to handle asynchronous data fetching and caching.
- **Layout Management**: Wraps standard pages in the `RootLayout` for consistent navigation and footer components.
