import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About";
import WelcomePage from "./pages/Welcome";
import Avatar from "./canvas";
import UserGuide from "./pages/UserGuide";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Account from "./pages/Account";
import "./index.css";
// ✅ IMPORT AUTH COMPONENTS
import { PublicRoute, ProtectedRoute } from "./components/auth/authentication";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <WelcomePage /> },
      {
        path: "/userGuide",
        element: <UserGuide />,
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/about",
        element: <About />
      }, {
        path: "/account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>)
      },
      {
        path: "*",
        element: <ErrorPage />
      }
    ],

  },
  {
    path: "/avatar",
    element: (
      <ProtectedRoute>
        <Avatar />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
