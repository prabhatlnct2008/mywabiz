import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './features/auth/useAuth'

// Layouts
import DashboardLayout from './components/Layout/DashboardLayout'

// Pages
import LandingPage from './features/landing/LandingPage'
import LoginPage from './features/auth/LoginPage'
import DashboardPage from './features/dashboard/DashboardPage'
import OnboardingWizard from './features/onboarding/OnboardingWizard'
import ProductsPage from './features/products/ProductsPage'
import OrdersPage from './features/orders/OrdersPage'
import SettingsPage from './features/settings/SettingsPage'

// Storefront (public)
import StorefrontPage from './features/storefront/pages/StorefrontPage'
import ProductPage from './features/storefront/pages/ProductPage'
import CheckoutPage from './features/storefront/pages/CheckoutPage'
import ConfirmationPage from './features/storefront/pages/ConfirmationPage'
import TrackingPage from './features/storefront/pages/TrackingPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#111827',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingWizard />
            </ProtectedRoute>
          }
        />

        {/* Public storefront routes */}
        <Route path="/store/:slug" element={<StorefrontPage />} />
        <Route path="/store/:slug/product/:productId" element={<ProductPage />} />
        <Route path="/store/:slug/checkout" element={<CheckoutPage />} />
        <Route path="/store/:slug/confirmation" element={<ConfirmationPage />} />
        <Route path="/orders/:trackToken" element={<TrackingPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
